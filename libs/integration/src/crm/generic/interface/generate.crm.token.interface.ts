import { CrmGenerateTokenResponseDto } from '../dto/crm.generate.token.response.dto';
import { GenerateTokenCrmRequestDto } from '../dto/generate.token.crm.dto';

export interface GenerateCrmTokenInterface {
  generateCrmToken(
    data: GenerateTokenCrmRequestDto,
  ): Promise<CrmGenerateTokenResponseDto>;
}
