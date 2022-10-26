import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TasksController } from '../tasks/tasks.controller';
import { AppEventBuss } from './app-event-buss';
import { TasksReadyForProcessingHandler } from './handlers/tasks-ready-for-processing-handler';


@Module({
    imports: [
        EventEmitterModule.forRoot()
    ],
    controllers: [],
    providers: [AppEventBuss, TasksReadyForProcessingHandler],
    exports: [AppEventBuss]
})
export class EventsModule {}
