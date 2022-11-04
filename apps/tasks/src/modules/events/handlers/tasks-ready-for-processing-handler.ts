import { AppEventBuss } from '../app-event-buss';
import { TasksReadyForProcessing } from '../events/tasks-ready-for-processing';
import { Injectable } from '@nestjs/common';
import { PubSubService } from '../../../../../shared/src/modules/pubsub/pub-sub.service';
import { PubSubChannels } from '../../../../../shared/src/modules/pubsub/pub-sub-channels';

@Injectable()
export class TasksReadyForProcessingHandler {

    constructor(
        private eventBus: AppEventBuss,
        private pubSubService: PubSubService
    ) {
        eventBus.on(TasksReadyForProcessing.eventName, (event) => {
            this.handle(event)
        })
    }

    private handle(event) {
        const taskIds: number[] = event
        this.pubSubService.publish(
            PubSubChannels.TaskReady, JSON.stringify(taskIds)
        ).catch((e) => console.log('Failed to send event', event) )

        console.log('Processing event', event)
    }

}