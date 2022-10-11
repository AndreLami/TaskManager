import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions/exception-filter.interface';
import { ArgumentsHost, Catch} from '@nestjs/common';
import { Response } from 'express';
import { HttpErrorRepresentable, IsHttpErrorRepresentable, IsTaskError } from './http.error.representable';
import { ApiErrorRenderer } from './api.error.renderer';
import { InternalError, TaskError } from './task.errors';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {

    private errorRenderer = new ApiErrorRenderer()

    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        console.log('Api error', exception)
        let error: TaskError & HttpErrorRepresentable
        if (IsHttpErrorRepresentable(exception) && IsTaskError(exception)) {
            error = exception
        } else {
            error = new InternalError()
        }

        let errorData = this.errorRenderer.renderError(error)
        response.status(error.httpStatus).json(errorData);
    }

}