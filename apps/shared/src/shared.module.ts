import { Module } from '@nestjs/common';
import { EchoModule } from './echo/EchoModule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfiguration } from './modules/database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return new DatabaseConfiguration(config).connectionConfig;
      },
      inject: [ConfigService],
    }),
    EchoModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class SharedModule {}
