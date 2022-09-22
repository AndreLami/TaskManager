import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiDocs } from './apiDocs/ApiDocs';

async function start() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  app.enableCors();
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(
  //     new BadRequestFilter(),
  //     new ForbiddenFilter(),
  //     new NotFoundFilter(),
  // );
  ApiDocs.setup(app)
  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
start();
