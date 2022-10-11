import { HttpErrorRepresentable } from './http.error.representable';
import { HttpStatus} from '@nestjs/common';

export class TaskError extends Error {

    constructor(
        readonly code: number,
        readonly description: string,
        readonly extra: any | null = null,
        readonly reasons: ErrorReason[] | null= null
    ) { super() }

}

export class ErrorReason {

    constructor(
        readonly code: number,
        readonly description: string,
        readonly extra: any | null = null
    ) {}

}

export class InternalError extends TaskError implements HttpErrorRepresentable {

    constructor() {
        super(100_0000, "Something went wrong");
    }

    httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR

}


export class TaskDoesNotExist extends TaskError implements HttpErrorRepresentable {

    constructor() {
        super(100_0001, "Task does not exist");
    }

    httpStatus: number = HttpStatus.NOT_FOUND

}

export class TooManyTaskDependencies extends TaskError implements HttpErrorRepresentable {

    constructor(readonly maxDependencies: number) {
        super(100_0002, "To many dependencies for task", {
            maxDependencies: maxDependencies
        });
    }

    httpStatus: number = HttpStatus.BAD_REQUEST

}

export class IncorrectTaskDependencies extends TaskError implements HttpErrorRepresentable {

    constructor() {
        super(100_0003, "Bad dependencies");
    }

    httpStatus: number = HttpStatus.BAD_REQUEST
}

export class CouldNotCompleteTaskTaskIsNotInProgressState extends TaskError implements HttpErrorRepresentable {

    constructor() {
        super(100_0004, "Task is not in progress state");
    }

    httpStatus: number = HttpStatus.BAD_REQUEST
}


export class ValidationError extends TaskError implements HttpErrorRepresentable {

    constructor(reasons: ErrorReason[]) {
        super(100_0005, "Validation error", null, reasons);
    }

    httpStatus: number = HttpStatus.BAD_REQUEST

}