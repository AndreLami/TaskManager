import { NestFactory } from '@nestjs/core';
import { NotifierModule } from './notifier.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const PORT = process.env.NOTIFIER_PORT || 3001;
  const app = await NestFactory.create(NotifierModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(PORT);
}
bootstrap();
