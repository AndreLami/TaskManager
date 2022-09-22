import { ConfigModule } from '@nestjs/config';
import { EchoService } from './EchoService';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule],
    providers: [EchoService],
    exports: [EchoService]
})
export class EchoModule {}