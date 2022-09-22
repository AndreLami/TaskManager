import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { EchoService } from '../../../shared/src/echo/EchoService';

@ApiTags('Address')
@Controller('api/tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get('ping')
    getPing() {
        return 'pong'
    }

    @Post('')
    createTask() {
        let task = this.tasksService.create("a", "b", [])
        return task
    }

    @Get('test')
    testTask() {
        return this.tasksService.test()
    }
}