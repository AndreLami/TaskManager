
import WebSocket, { WebSocketServer as WSServer} from 'ws';
import { ReadyTaskConsumer } from './ready-task-consumer';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';

export class WsReadyTaskConsumer implements ReadyTaskConsumer {

    constructor(private socket: WebSocket, readonly identifier: string) {}

    notifyTaskIsReady(tasks: TaskEntity[]) {
        this.socket.send(JSON.stringify(tasks))
    }

}