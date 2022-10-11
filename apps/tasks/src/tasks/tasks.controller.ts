import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { EchoService } from '../../../shared/src/echo/EchoService';
import { CreateTaskDto } from './dto/create.task.dto';
import { TaskEntity } from '../../../shared/src/entities/task.entity';

@ApiTags('Address')
@Controller('api/tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

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
        return this.tasksService.test()
    }
}