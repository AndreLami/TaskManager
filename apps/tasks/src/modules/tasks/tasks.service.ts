import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';
import {
    CouldNotCompleteTaskTaskIsNotInProgressState,
    IncorrectTaskDependencies, TaskDoesNotExist,
    TooManyTaskDependencies,
} from '../../errors/task.errors';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskDependencyEntity } from '../../../../shared/src/entities/task.dependency.entity';
import { TaskStatus, TaskVisibility } from '../../../../shared/src/entities/task.status';
import { TasksHelper } from './tasks.helper';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { AppLogger } from '../../../../shared/src/modules/logging/app-logger';
import { AppEventBuss } from '../events/app-event-buss';
import { TasksReadyForProcessing } from '../events/events/tasks-ready-for-processing';

@Injectable()
export class TasksService {

    private readonly maxDependenciesNumber = 10;

    constructor(
        @InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(TaskDependencyEntity) private readonly taskDependencyRepository: Repository<TaskDependencyEntity>,
        private appEventBus: AppEventBuss,
        private logger: AppLogger,
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

    async getTask(taskId: number): Promise<TaskEntity> {
        const task = await this.taskRepository.findOne({ where: { id: taskId }})
        if (task === null) {
            throw new TaskDoesNotExist()
        }

        return task
    }

    async getTasks(tasksRequest: GetTasksDto): Promise<TaskEntity[]> {
        let query: any = { where: {} };
        if (tasksRequest.taskStatuses?.length > 0) {
            query.where.status = In(tasksRequest.taskStatuses)
        }

        const tasks = await this.taskRepository.find(query)
        return tasks
    }

    async create(taskData: CreateTaskDto): Promise<TaskEntity> {
        if (taskData.dependencies.length > this.maxDependenciesNumber) {
            throw new TooManyTaskDependencies(this.maxDependenciesNumber);
        }

        const dependenciesCount = await this.taskRepository.count({
            where: {
                id: In(taskData.dependencies), visibility: TaskVisibility.Visible
            }
        })

        if (dependenciesCount < taskData.dependencies.length) {
            throw new IncorrectTaskDependencies()
        }

        const initialStatus = dependenciesCount > 0 ? TaskStatus.Pending : TaskStatus.InProgress
        let task = this.taskRepository.create({
            name: taskData.name, description: taskData.description,
            visibility: TaskVisibility.Invisible,
            status: initialStatus
        })

        task = await this.taskRepository.save(task);
        if (dependenciesCount > 0) {
            task.parents = []
            for (let dependencyId of taskData.dependencies) {
                const dependency = this.taskDependencyRepository.create({
                    child: task,
                    parent: <TaskEntity>{id: dependencyId}
                })
                task.parents.push(dependency)
            }

            await this.taskDependencyRepository.save(task.parents)
        }

        if (dependenciesCount > 0) {
            const adjustedTask = await this.adjustTasksInProgressStatus([task])
            task = adjustedTask[0]
        }

        task.visibility = TaskVisibility.Visible
        task = await this.taskRepository.save(task)

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

        let readyForInProgressTasks = await TasksHelper.collectReadyForInProgressTasks(taskIds, this.taskRepository)
        readyForInProgressTasks.forEach(task => { task.status = TaskStatus.InProgress })
        readyForInProgressTasks = await this.taskRepository.save(readyForInProgressTasks)

        this.notifyTasksAreReadyForProcessingIfNeeded(readyForInProgressTasks)
        let seenIds = new Set<number>(readyForInProgressTasks.map( task => task.id))
        let resultTasks: TaskEntity[] = readyForInProgressTasks
        for (let task of tasks) {
            if (!seenIds.has(task.id)) {
                resultTasks.push(task)
            }
        }

        return resultTasks
    }

    private notifyTasksAreReadyForProcessingIfNeeded(tasks: TaskEntity[]) {
        const readyTasksIds = tasks.filter( task => {
            return task.isVisible && task.isInProgress
        }).map( task => task.id )

        if (readyTasksIds.length > 0) {
            this.appEventBus.fire(new TasksReadyForProcessing(readyTasksIds))
        }
    }

}