import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { EchoModule } from '../../../shared/src/echo/EchoModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../../../shared/src/entities/task.entity';
import { TaskDependencyEntity } from '../../../shared/src/entities/task.dependency.entity';

@Module({
    imports: [
        EchoModule,
        TypeOrmModule.forFeature([TaskEntity, TaskDependencyEntity])
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
