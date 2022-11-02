import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis'
import { Buffer } from 'buffer';

@Injectable()
export class PubSubService {

    private redisPublisher: Redis
    private redisSubscriber: Redis

    constructor(configService: ConfigService) {
        const redisHost = configService.get('REDIS_HOST')
        const redisPort = configService.get('REDIS_PORT')

        if (redisPort == undefined || redisHost == undefined) {
            const redisError = "Could not start pub/sub service. Host/Port not defined in config!"
            console.log('Redis error', redisError)
            throw redisError
        }

        this.redisPublisher = new Redis({host: redisHost, port: redisPort})
        this.redisSubscriber = new Redis({host: redisHost, port: redisPort})
    }

    publish(channel: string, message: string | Buffer): Promise<number> {
        return this.redisPublisher.publish(channel, message)
    }

    subscribe(channel: string, callback: (message: string) => void): Promise<Boolean> {
        return this.redisSubscriber.subscribe(channel).then(() => {
            this.redisSubscriber.on('message', (incomingChannel, message) => {
                if (incomingChannel == channel) {
                    callback(message)
                }
            })

            return true
        })
    }
}