import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ValidationMessage } from '../../utils/validation/validation.message';

export class CreateTaskDto {
    @ApiProperty({ example: 'Boil egg', description: 'Name of the task' })
    @IsNotEmpty({ message: ValidationMessage('Task name should not be empty') })
    @IsString({ message: ValidationMessage('Task name should not be a string') })
    name: string;

    @ApiProperty({
        example: 'Put egg in boiling water', description: 'Task description'
    })
    @IsNotEmpty({ message: 'Task description should not be empty' })
    @IsString({ message: ValidationMessage('Task description should not be a string') })
    description: string;

    @ApiProperty({ example: '[1, 2, 3, 4]', description: 'Task dependencies' })
    @IsArray({message: ValidationMessage('Task dependencies should be an array') })
    @IsInt({each: true, message: ValidationMessage('Task dependency should be a number') })
    @IsOptional()
    dependencies?: number[];
}