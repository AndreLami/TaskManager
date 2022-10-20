import { Body, Controller, Get, LoggerService, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { TaskEntity } from '../../../../shared/src/entities/task.entity';
import { AppLogger } from '../../../../shared/src/modules/logging/app-logger';

@ApiTags('Address')
@Controller('api/tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService,
        private logger: AppLogger,
    ) {}

    @Get('ping')
    getPing() {
        return 'pong'
    }

    @ApiOperation({ summary: 'Create task' })
    @ApiResponse({
        status: 200,
        type: TaskEntity,
        description: 'Created task',
    })
    @Post('')
    async createTask(@Body() taskData: CreateTaskDto) {
        let task = await this.tasksService.create(taskData)
        return task
    }

    @ApiOperation({ summary: 'Complete task' })
    @ApiResponse({
        status: 200,
        type: TaskEntity,
        description: 'Completed task',
    })
    @Post(':id/complete')
    async completeTask(@Param('id') taskId: number) {
        let task = await this.tasksService.complete(taskId)
        return task
    }

    @Get('test')
    testTask() {
        this.logger.warn("Hello", "123", "321")
        return 'Ok'
    }
}