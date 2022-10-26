import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvent } from './events/app-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppEventBuss extends EventEmitter2 {

    fire<T>(event: AppEvent<T>) {
        const values = []
        if (event.payload !== undefined) {
            values.push(event.payload)
        }

        this.emit(event.eventName, ...values)
    }

}