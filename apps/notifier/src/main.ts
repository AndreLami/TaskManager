import { NestFactory } from '@nestjs/core';
import { NotifierModule } from './notifier.module';

async function bootstrap() {
  const PORT = process.env.NOTIFIER_PORT || 3001;
  const app = await NestFactory.create(NotifierModule);
  await app.listen(PORT);
}
bootstrap();
