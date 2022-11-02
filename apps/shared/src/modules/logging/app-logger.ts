import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { createLogger, transports, Logger, format} from "winston";
import * as Transport from 'winston-transport';
import { AppEnvironment } from '../../env/app.environment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppLogger implements LoggerService {

    private internalLogger: Logger

    constructor(configService: ConfigService) {
        let loggerTransports: Transport[] = [
            new transports.Console({
                level: 'info',
                format: format.combine(
                    format.timestamp(),
                    format.errors({ stack: true }),
                    format.colorize(),
                    format.printf(
                        (info) => {
                            const splat = info[Symbol.for('splat') as any] || [];
                            const rest = splat.map( item => `${item}`). join(' ')
                            return `${info.timestamp}  ${info.level} : ${info.message} ${rest}`
                        }
                    ),

                    format.splat()
                ),
            }),
        ];

        if (configService.get<string>('APP_ENV') !== AppEnvironment.Dev) {
            const client = new Client({
                node: 'http://localhost:9200',
            })

            const esTransportOpts = {
                level: 'info',
                index: 'api-logs',
                client : client,
                source: 'api'
            };

            let elasticTransport = new ElasticsearchTransport(esTransportOpts);
            loggerTransports.push(elasticTransport)
        }

        this.internalLogger = createLogger({
            transports: loggerTransports
        });
    }

    debug(message: any, ...optionalParams: any[]): any {
        this.internalLogger.warn("qwe", 'qweqwe', 'zzz')
        console.log('MyLogger', message, optionalParams)
    }

    error(message: any, ...optionalParams: any[]): any {
        console.log('MyLogger', message, optionalParams)
    }

    log(message: any, ...optionalParams: any[]): any {
        console.log('MyLogger', message, optionalParams)
    }

    setLogLevels(levels: LogLevel[]): any {

    }

    verbose(message: any, ...optionalParams: any[]): any {
        console.log('MyLogger', message, optionalParams)
    }

    warn(message: any, ...optionalParams: any[]): any {
        optionalParams.unshift(message);
        (this.internalLogger.warn as any)(...optionalParams)
    }

}