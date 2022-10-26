import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ValidationMessage } from '../../../utils/validation/validation.message';
import { TaskStatus } from '../../../../../shared/src/entities/task.status';

export class GetTasksDto {

    @ApiProperty({ example: '[0, 1]', description: 'Statuses' })
    @IsArray({ message: ValidationMessage('Task statuses must be an array') })
    @IsInt({each: true, message: ValidationMessage('Task status must be a number') })
    @IsOptional()
    taskStatuses: TaskStatus[] | undefined;

}