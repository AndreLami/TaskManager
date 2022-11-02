import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiDocs } from './api-docs/api-docs';
import { ApiExceptionFilter } from './errors/api.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidationErrorFormatterInterceptor } from './errors/validation.error.formatter.interceptor';

async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.TASKS_PORT || 3000;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
      new ApiExceptionFilter(),
  );
  app.useGlobalInterceptors(new ValidationErrorFormatterInterceptor())
  ApiDocs.setup(app)
  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
start();
