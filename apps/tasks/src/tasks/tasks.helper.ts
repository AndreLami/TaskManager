import { Repository } from 'typeorm';
import { TaskEntity } from '../../../shared/src/entities/task.entity';
import { TaskStatus } from '../../../shared/src/entities/task.status';


export class TasksHelper {

    static async collectReadyForInProgressTasks(
        taskIds: number[], repository: Repository<TaskEntity>
    ): Promise<number[]> {
        if (taskIds.length <= 0) {
            return []
        }

        const result = await repository.manager.query(
            "SELECT link.childId as taskId, link.childId as childId, SUM(parent.status) as statusSum, count(parent.id) as totalParents " +
            "FROM task_dependencies as link " +
            "LEFT JOIN tasks as parent ON parent.id = link.parentId " +
            "WHERE link.childId IN (?) " +
            "GROUP BY link.childId " +
            "HAVING statusSum = totalParents * ?;",
            [taskIds, TaskStatus.Completed]
        )

        let readyTaskIds = result.map(readyTask => readyTask.taskId )
        return readyTaskIds
    }

}