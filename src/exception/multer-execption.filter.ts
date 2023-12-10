import { Catch, ExceptionFilter, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as Multer from 'multer';

@Catch(Multer.MulterError) // Only catch Multer errors
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: Multer.MulterError, host: ArgumentsHost) {
    console.error('Multer Error:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'File upload failed. Please check the file format and size.',
    });
  }
}
