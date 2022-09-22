import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import configuration from './configuration/configuration';
import { SharedModule } from '../../shared/src/shared.module';

@Module({
  imports: [
      ConfigModule.forRoot(configuration()),
      SharedModule,
      TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
