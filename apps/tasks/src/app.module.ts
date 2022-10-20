import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { TasksModule } from './modules/tasks/tasks.module';
import configuration from './configuration/configuration';
import { SharedModule } from '../../shared/src/shared.module';
import { LoggerModule } from '../../shared/src/modules/logging/logger.module';

@Module({
  imports: [
      ConfigModule.forRoot(configuration()),
      SharedModule,
      TasksModule,
      LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
