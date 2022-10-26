import { AppEvent } from './app-event';


export class TasksReadyForProcessing extends AppEvent<number[]> {

    static eventName = "ready.for.processing.task"

    constructor(readonly payload: number[]) {
        super();
    }
}