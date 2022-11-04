import { Injectable } from '@nestjs/common';
import { ReadyTaskConsumer } from './ready-task-consumer';
import { PubSubService } from '../../../../shared/src/modules/pubsub/pub-sub.service';
import { PubSubChannels } from '../../../../shared/src/modules/pubsub/pub-sub-channels';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';
import { TasksResolverService } from '../tasks-resolver/tasks-resolver.service';


@Injectable()
export class ReadyTasksRelayService {

    private consumers = new Map<string, ReadyTaskConsumer>()

    constructor(
        private pubSubService: PubSubService,
        private tasksResolverService: TasksResolverService
    ) {
        this.pubSubService.subscribe(PubSubChannels.TaskReady, async (message) => {
            await this.handleTaskReadyMessage(message)
        }).catch((e) => console.log('Error', e))
    }

    registerConsumer(consumer: ReadyTaskConsumer) {
        this.consumers.set(consumer.identifier, consumer)
    }

    deregisterConsumer(consumerId: string) {
        this.consumers.delete(consumerId)
    }

    private async handleTaskReadyMessage(tasksReadyMessage: any) {
        try {
            const taskIds: number[] = JSON.parse(tasksReadyMessage)
            const tasks = await this.tasksResolverService.resolveTasks(taskIds)
            this.consumers.forEach((consumer, _) => {
                consumer.notifyTaskIsReady(tasks)
            })
        } catch (e) {
            console.log('Could not relay tasks ready message', e)
        }

    }

}