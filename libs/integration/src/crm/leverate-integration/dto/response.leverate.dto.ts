import { InfoResponseLeverateDto } from './result.response.leverate.dto';

export class ResponseLeverateDto {
  constructor(data?: ResponseLeverateDto) {
    Object.assign(this, data ?? {});
  }
  result: InfoResponseLeverateDto;
  tradingPlatformUpdated: boolean;
}
