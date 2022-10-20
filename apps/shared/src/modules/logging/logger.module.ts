import { ConfigModule} from '@nestjs/config';
import { AppLogger } from './app-logger';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [AppLogger],
    exports: [AppLogger]
})
export class LoggerModule {}
