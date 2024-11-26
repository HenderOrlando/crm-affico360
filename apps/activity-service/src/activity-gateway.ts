import { EnvironmentEnum } from '@common/common/enums/environment.enum';
import { bootstrapGateway } from '@common/common/models/bootstrap.gateway';
import { ActivityServiceModule } from './activity-service.module';

bootstrapGateway(ActivityServiceModule, EnvironmentEnum.dev, 3001);
