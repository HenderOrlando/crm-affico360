import { EnvironmentEnum } from '@common/common/enums/environment.enum';

export interface BasicDataIntegration {
  username?: string;
  password?: string;
  urlSandbox?: string;
  urlApi?: string;
  apiKey?: string;
  publicKey?: string;
  privateKey?: string;
  token?: string;
  env?: EnvironmentEnum;
}
