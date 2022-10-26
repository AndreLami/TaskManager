import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { EchoModule } from '../../../../shared/src/echo/EchoModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';
import { TaskDependencyEntity } from '../../../../shared/src/entities/task.dependency.entity';
import { LoggerModule } from '../../../../shared/src/modules/logging/logger.module';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        EchoModule,
        TypeOrmModule.forFeature([TaskEntity, TaskDependencyEntity]),
        LoggerModule,
        EventsModule
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
