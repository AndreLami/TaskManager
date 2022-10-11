import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { ErrorReason, ValidationError } from './task.errors';


@Injectable()
export class ValidationErrorFormatterInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
        .handle()
        .pipe(
            catchError( err => {
                let resultError
                if (err instanceof BadRequestException) {
                    resultError = this.formatBadRequestError(err)
                } else {
                    resultError = err
                }

                throw resultError
            })
        );
    }

    private formatBadRequestError(error: BadRequestException) {
        const messages = error.getResponse()['message']
        if (Array.isArray(messages)) {
            const reasons = messages.map( message => {
                const [name, description] = message.split(':')
                if (name === undefined || !!description === undefined) {
                    return null
                }

                return new ErrorReason(1, description, { field: name })
            }).filter( reason => reason != null )

            return new ValidationError(reasons)
        }

        return error
    }
}