export class CrmGenerateTokenResponseDto {
  constructor(data: CrmGenerateTokenResponseDto) {
    this.token = data.token;
    this.expTime = new Date(data.expTime);
  }
  data?: {
    token: string;
    expTime: Date;
  };
  token: string;
  expTime: Date;
}
