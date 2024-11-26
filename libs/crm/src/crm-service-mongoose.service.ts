import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import { CrmCreateDto } from '@crm/crm/dto/crm.create.dto';
import { CrmUpdateDto } from '@crm/crm/dto/crm.update.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CrmServiceMongooseService extends BasicServiceModel<
  CrmDocument,
  Model<CrmDocument>,
  CrmCreateDto,
  CrmUpdateDto
> {
  constructor(@Inject('CRM_MODEL_MONGOOSE') crmModel: Model<CrmDocument>) {
    super(crmModel);
  }
}
