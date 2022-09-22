import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../../../shared/src/entities/task.entity';
import {
    CouldNotCompleteTaskTaskIsNotInProgressState,
    IncorrectTaskDependencies, TaskDoesNotExist,
    TooManyTaskDependencies,
} from '../errors/task.errors';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskDependencyEntity } from '../../../shared/src/entities/task.dependency.entity';
import { TaskStatus, TaskVisibility } from '../../../shared/src/entities/task.status';
import { TasksHelper } from './tasks.helper';
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';

@Injectable()
export class TasksService {

    private readonly maxDependenciesNumber = 10;

    constructor(
        @InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(TaskDependencyEntity) private readonly taskDependencyRepository: Repository<TaskDependencyEntity>,
    ) {}

    async test() {
        const res = await this.adjustDependentTasksInProgressStatus(1)
        console.log(res)
        return res
    }

    async complete(taskId: number): Promise<TaskEntity> {
        let task = await this.taskRepository.findOne({ where: {
            id: taskId, visibility: TaskVisibility.Visible
        } })

        if (task == undefined) {
            throw new TaskDoesNotExist()
        }

        if (task.status != TaskStatus.InProgress) {
            throw new CouldNotCompleteTaskTaskIsNotInProgressState()
        }

        task.status = TaskStatus.Completed
        task = await this.taskRepository.save(task)
        await this.adjustDependentTasksInProgressStatus(taskId)
        return task
    }

    async create(title: string, description: string, dependencies: number[]): Promise<TaskEntity> {
        if (dependencies.length > this.maxDependenciesNumber) {
            throw new TooManyTaskDependencies(this.maxDependenciesNumber);
        }

        const dependenciesCount = await this.taskRepository.count({
            where: {
                id: In(dependencies), visibility: TaskVisibility.Visible
            }
        })

        if (dependenciesCount < dependencies.length) {
            throw new IncorrectTaskDependencies()
        }

        let task = this.taskRepository.create({
            title: title, description: description,
            visibility: TaskVisibility.Invisible,
            status: TaskStatus.Pending
        })

        task = await this.taskRepository.save(task);
        if (dependenciesCount > 0) {
            task.parents = []
            for (let dependencyId of dependencies) {
                const dependency = this.taskDependencyRepository.create({
                    child: task,
                    parent: <TaskEntity>{id: dependencyId}
                })
                task.parents.push(dependency)
            }

            await this.taskRepository.save(task)
        }

        await this.adjustTasksInProgressStatus([task])
        task = await this.taskRepository.save({
            id: task.id, visibility: TaskVisibility.Visible
        })

        this.notifyTasksAreReadyForProcessingIfNeeded([task])
        return task
    }

    private async adjustDependentTasksInProgressStatus(parentId: number) {
        const query = this.taskRepository.createQueryBuilder('child')
            .leftJoin('child.children', 'link')
            .leftJoin('link.parent', 'parent')
            .where(
                'parent.id = :parentId AND child.status = :status',
                { parentId, status: TaskStatus.Pending },
            )

        const dependentTasks = await query.getMany();
        await this.adjustTasksInProgressStatus(dependentTasks)
    }

    private async adjustTasksInProgressStatus(tasks: TaskEntity[]) {
        const taskIds = tasks
            .filter((task) => task.status == TaskStatus.Pending)
            .map( task => task.id)

        const readyForInProgressTaskIds = await TasksHelper.collectReadyForInProgressTasks(taskIds, this.taskRepository)
        const statusChangedTasks: [TaskEntity] = readyForInProgressTaskIds.map( taskId => {
            return {id: taskId, status: TaskStatus.InProgress}
        })


        const resultTasks = await this.taskDependencyRepository.save(statusChangedTasks)
        this.notifyTasksAreReadyForProcessingIfNeeded(resultTasks)

        return resultTasks
    }

    private notifyTasksAreReadyForProcessingIfNeeded(tasks: TaskEntity[]) {
        const readyTasksIds = tasks.filter( task => {
            return task.isVisible && task.isInProgress
        }).map( task => task.id )

        if (readyTasksIds.length > 0) {
            // this.notificationService.notify(new ReadyForProcessingTasks(readyTasksIds))
        }
    }

}