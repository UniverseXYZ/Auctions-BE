import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from "./http-exception-response.interface";
import { Request, Response } from "express";

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (Array.isArray((errorResponse as HttpExceptionResponse).message)) {
        errorMessage = (
          errorResponse as HttpExceptionResponse
        ).message.toString();
      } else {
        errorMessage =
          (errorResponse as HttpExceptionResponse).error || exception.message;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Critical error bro";
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);
    // * write to error log here?
    //this.logError(errorResponse, request, exception);

    response.status(status).json(errorResponse);
  }

  private getErrorResponse(
    status: HttpStatus,
    errorMessage: string,
    request: Request
  ): CustomHttpExceptionResponse {
    return {
      statusCode: status,
      error: errorMessage,
      path: request.url,
      method: request.method,
      timeStamp: new Date(),
    };
  }

  private logError(
    errorResponse: CustomHttpExceptionResponse,
    request: Request,
    exception: unknown
  ): void {}
}
