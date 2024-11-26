import { bootstrapMicroservice } from '@common/common/models/bootstrap.microservices';
import { ActivityServiceModule } from './activity-service.module';
import { EnvironmentEnum } from '@common/common/enums/environment.enum';

bootstrapMicroservice(ActivityServiceModule, EnvironmentEnum.dev);
