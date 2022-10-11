import { HttpException } from '@nestjs/common';
import { TaskError } from './task.errors';

export interface HttpErrorRepresentable {

    httpStatus: number

}

export function IsTaskError(object: any): object is TaskError {
    return 'code' in object && 'description' in object;
}

export function IsHttpErrorRepresentable(object: any): object is HttpErrorRepresentable {
    return 'httpStatus' in object;
}