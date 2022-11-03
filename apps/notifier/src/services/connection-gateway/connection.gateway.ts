import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect, OnGatewayInit,
} from '@nestjs/websockets';

import WebSocket, { WebSocketServer as WSServer} from 'ws';
import { IncomingMessage } from 'http';
import { ReadyTasksRelayService } from '../ready-tasks-relay/ready-tasks-relay.service';

type WsWithId = WebSocket & {identifier: string}

@WebSocketGateway(3002,  { transports: ['websocket'] })
export class ConnectionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: WSServer;

    constructor(
        private readTaskRelayService: ReadyTasksRelayService
    ) {}

    afterInit(server: WebSocket) {
        console.log('Initialized .....');
    }

    handleConnection(client: WsWithId, message: IncomingMessage) {
        client.identifier = this.generateId()
        this.readTaskRelayService
        console.log('Client connected:', message);
    }

    handleDisconnect(client: WsWithId) {
        console.log('Client disconnected:', client);
    }

    private counter: number = 0
    private generateId(): string {
        const id = `${this.counter}`
        this.counter += 1
        return id
    }

}