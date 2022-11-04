import { Module } from '@nestjs/common';
import { NotifierController } from './notifier.controller';
import { NotifierService } from './notifier.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration/configuration';
import { PubSubModule } from '../../shared/src/modules/pubsub/pub-sub.module';
import { ConnectionGateway } from './services/connection-gateway/connection.gateway';
import { ReadyTasksRelayService } from './services/ready-tasks-relay/ready-tasks-relay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../../shared/src/entities/task.entity';
import { TaskDependencyEntity } from '../../shared/src/entities/task.dependency.entity';
import { SharedModule } from '../../shared/src/shared.module';
import { TasksResolverService } from './services/tasks-resolver/tasks-resolver.service';

@Module({
  imports: [
      ConfigModule.forRoot(configuration()),
      PubSubModule,
      SharedModule,
      TypeOrmModule.forFeature([TaskEntity, TaskDependencyEntity]),
  ],
  controllers: [NotifierController],
  providers: [
      NotifierService,
      ConnectionGateway,
      ReadyTasksRelayService,
      TasksResolverService
  ],
})
export class NotifierModule {}
