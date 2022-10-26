import { AppEventBuss } from '../app-event-buss';
import { TasksReadyForProcessing } from '../events/tasks-ready-for-processing';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksReadyForProcessingHandler {

    constructor(eventBus: AppEventBuss) {
        eventBus.on(TasksReadyForProcessing.eventName, this.handle)
    }

    private handle(event) {
        console.log('Processing event', event)
    }

}