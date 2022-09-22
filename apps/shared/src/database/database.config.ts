import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export class DatabaseConfiguration {
    constructor(private readonly configService: ConfigService) {}

    get connectionConfig(): TypeOrmModuleOptions {
        return {
            type: 'mariadb',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
            entities: ['./shared/src/entities/*.entity.{ts,js}'],
            multipleStatements: true,
            autoLoadEntities: true,
            synchronize: this.configService.get<string>('APP_ENV') === 'dev',
            migrationsRun: this.configService.get<string>('APP_ENV') !== 'dev',
            migrations: ['./dist/migrations/*.{ts,js}'],
            migrationsTableName: "ci_migrations"
        };
    }
}