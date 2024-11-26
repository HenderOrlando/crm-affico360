export class GenerateTokenCrmRequestDto {
  constructor(data: GenerateTokenCrmRequestDto) {
    Object.assign(this, data);
  }

  organization: string;
  id: string;
  secret: string;
}
