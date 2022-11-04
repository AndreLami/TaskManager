import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';
import { In, Repository } from 'typeorm';


@Injectable()
export class TasksResolverService {

    constructor(
        @InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>,
    ) {}

    async resolveTasks(taskIds: number[]): Promise<TaskEntity[]> {
        return this.taskRepository.find({where: {id: In(taskIds)}})
    }

}