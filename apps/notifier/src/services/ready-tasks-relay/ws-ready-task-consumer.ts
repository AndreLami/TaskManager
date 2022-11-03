
import WebSocket, { WebSocketServer as WSServer} from 'ws';
import { ReadyTaskConsumer } from './ready-task-consumer';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';

export class WsReadyTaskConsumer implements ReadyTaskConsumer {

    constructor(private socket: WebSocket) {}

    notifyTaskIsReady(task: TaskEntity) {
        this.socket.send({'id': task.id} )
    }



}