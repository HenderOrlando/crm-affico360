import { CreateLeadAffiliateDto } from '@affiliate/affiliate/domain/dto/create-lead-affiliate.dto';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import { AntelopeIntegrationService } from '@integration/integration/crm/antelope-integration/antelope-integration.service';
import { LeverateIntegrationService } from '@integration/integration/crm/leverate-integration/leverate-integration.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { AntelopeRegisterLeadDto } from './crm/antelope-integration/dto/antelope-register-lead.dto';
import IntegrationCrmEnum from './crm/enums/IntegrationCrmEnum';
import { IntegrationCrmService } from './crm/generic/integration.crm.service';
import { RegisterLeadLeverateRequestDto } from './crm/leverate-integration/dto/register.lead.leverate.request.dto';

@Injectable()
export class IntegrationService {
  private env: string;
  constructor(private readonly configService: ConfigService) {
    this.env = configService.get('ENVIRONMENT');
  }

  async getCrmIntegration(
    crm: CrmDocument,
    crmCategoryName: string,
    url: string,
    username: string,
    password: string,
    apiKey: string,
    token: string,
  ): Promise<IntegrationCrmService> {
    const crmType = this.getCrmType(crmCategoryName, crm);
    //username,        password,        token,        apiKey,
    crmType.setToken(token);
    crmType.setUrlBase(url);
    crmType.setApiKey(apiKey);
    crmType.setUsername(username ?? crm.userCrm);
    crmType.setPassword(password ?? crm.passwordCrm);
    await crmType.generateHttp();
    return crmType;
  }

  getCrmRegisterLeadDto(
    crmCategoryName: string,
    leadDto: CreateLeadAffiliateDto,
  ) {
    switch (crmCategoryName.toUpperCase()) {
      case IntegrationCrmEnum.ANTELOPE:
        return new AntelopeRegisterLeadDto(leadDto);
      case IntegrationCrmEnum.LEVERATE:
        return new RegisterLeadLeverateRequestDto(leadDto);
    }
  }

  private getCrmType(
    crmCategoryName: string,
    crm: CrmDocument,
  ): IntegrationCrmService {
    let crmType: IntegrationCrmService;
    switch (crmCategoryName.toUpperCase()) {
      case IntegrationCrmEnum.ANTELOPE:
        crmType = new AntelopeIntegrationService(crm, this.configService);
        break;
      case IntegrationCrmEnum.LEVERATE:
        crmType = new LeverateIntegrationService(crm, this.configService);
        break;
    }
    if (!crmType) {
      throw new RpcException('The CRM "' + crmCategoryName + '" has not found');
    }
    return crmType;
  }
}
