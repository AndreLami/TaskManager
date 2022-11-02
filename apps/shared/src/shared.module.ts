import { Module } from '@nestjs/common';
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
    })
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class SharedModule {}
