import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TasksModule } from '../modules/tasks/tasks.module';
import { AppEnvironment } from '../../../shared/src/env/app.environment';


export class ApiDocs {

    static setup(app: INestApplication) {
        if (process.env.APP_ENV == AppEnvironment.Prod) {
            return
        }

        const tasksConfig = new DocumentBuilder()
        .setTitle('Application Api')
        .setDescription('API documentation')
        .setVersion('0.1.0')
        .build();

        const apiDocument = SwaggerModule.createDocument(app, tasksConfig, {
            include: [
                TasksModule,
            ],
        });

        SwaggerModule.setup('/docs/api', app, apiDocument);
    }

}