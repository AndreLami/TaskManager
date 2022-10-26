

export class AppEvent<Payload> {

    static eventName = "Generic"

    readonly payload: Payload

    get eventName(): string {
        return (<typeof AppEvent>this.constructor).eventName
    }




}