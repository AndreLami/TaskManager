import { Controller, Get } from '@nestjs/common';
import { NotifierService } from './notifier.service';
import { PubSubService } from '../../shared/src/modules/pubsub/pub-sub.service';
// import { Redis } from 'ioredis';
const Redis = require("ioredis");

@Controller()
export class NotifierController {

  private counter = 1

  constructor(private readonly pubSubService: PubSubService) {

    pubSubService.subscribe("channel1", (message) => {
      console.log(`Channel: channel1. Message: ${message}`)
    }).catch((err) => console.log('Could not subscribe to channel1' ,err ))

    pubSubService.subscribe("channel2", (message) => {
      console.log(`Channel: channel2. Message: ${message}`)
    }).catch((err) => console.log('Could not subscribe to channel2' ,err ))
  }

}
