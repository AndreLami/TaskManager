
import { ConfigModule} from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PubSubService } from './pub-sub.service';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [PubSubService],
    exports: [PubSubService]
})
export class PubSubModule {}
