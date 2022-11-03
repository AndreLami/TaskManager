import { TaskEntity } from '../../../../shared/src/entities/task.entity';


export interface ReadyTaskConsumer {

    identifier: string
    
    notifyTaskIsReady(task: TaskEntity)

}