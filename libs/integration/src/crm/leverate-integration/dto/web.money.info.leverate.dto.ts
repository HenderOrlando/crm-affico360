export class WebMoneyInfoLeverateDto {
  constructor(data?: WebMoneyInfoLeverateDto) {
    Object.assign(this, data ?? {});
  }
  email: string;
  number: string;
}
