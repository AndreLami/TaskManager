import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
    constructor(private configService: ConfigService) {
    }

    getSomeVal() {
        console.log("Here", this.configService)
        return this.configService.get("SOME_ENV")
    }
}