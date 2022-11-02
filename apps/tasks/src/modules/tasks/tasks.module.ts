import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';
import { TaskDependencyEntity } from '../../../../shared/src/entities/task.dependency.entity';
import { LoggerModule } from '../../../../shared/src/modules/logging/logger.module';
import { EventsModule } from '../events/events.module';
import { PubSubModule } from '../../../../shared/src/modules/pubsub/pub-sub.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity, TaskDependencyEntity]),
        LoggerModule,
        EventsModule,
        PubSubModule,
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
