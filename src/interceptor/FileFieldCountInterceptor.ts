import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';


@Injectable()
export class CustomFileFieldsInterceptor implements NestInterceptor {
  constructor(private readonly fields: Array<{ name: string; maxCount?: number }>, private readonly options?: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request['files']; // Access the uploaded files



    // Handle errors here based on your requirements
    if (!files) {
      throw new BadRequestException('No files were uploaded.');
    }

    // Perform additional validation or error handling if needed
    for (const field of this.fields) {
      const uploadedFiles = files[field.name];
      if (!uploadedFiles) {
        throw new BadRequestException(`No files were uploaded for field '${field.name}'.`);
      }

      // Check if maxCount is exceeded
      if (field.maxCount && uploadedFiles.length > field.maxCount) {
        throw new BadRequestException(`Maximum file count (${field.maxCount}) exceeded for field '${field.name}'.`);
      }
    }

    return next.handle();
  }
}
