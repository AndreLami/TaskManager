import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class EchoService {

    constructor(private configService: ConfigService) {}

    getEcho() {
        return this.configService.get("APP_ECHO")
    }
}