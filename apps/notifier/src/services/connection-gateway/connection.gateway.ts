import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, OnGatewayInit,
} from '@nestjs/websockets';

import WebSocket, { WebSocketServer as WSServer} from 'ws';
import { IncomingMessage } from 'http';
import { ReadyTasksRelayService } from '../ready-tasks-relay/ready-tasks-relay.service';
import { WsReadyTaskConsumer } from '../ready-tasks-relay/ws-ready-task-consumer';

type WsWithId = WebSocket & {identifier: string}

@WebSocketGateway()
export class ConnectionGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: WSServer;

    constructor(
        private readyTaskRelayService: ReadyTasksRelayService
    ) {}

    handleConnection(client: WsWithId, message: IncomingMessage) {
        client.identifier = this.generateId()
        this.readyTaskRelayService.registerConsumer(
            new WsReadyTaskConsumer(client, client.identifier)
        )
    }

    handleDisconnect(client: WsWithId) {
        this.readyTaskRelayService.deregisterConsumer(client.identifier)
    }

    private counter: number = 0
    private generateId(): string {
        const id = `${this.counter}`
        this.counter += 1
        return id
    }

}