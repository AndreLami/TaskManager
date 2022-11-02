import { Module } from '@nestjs/common';
import { NotifierController } from './notifier.controller';
import { NotifierService } from './notifier.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration/configuration';
import { PubSubModule } from '../../shared/src/modules/pubsub/pub-sub.module';

@Module({
  imports: [ConfigModule.forRoot(configuration()), PubSubModule],
  controllers: [NotifierController],
  providers: [NotifierService],
})
export class NotifierModule {}
