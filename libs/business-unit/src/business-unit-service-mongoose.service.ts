import { BusinessUnitDocument } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { BusinessUnitCreateDto } from '@business-unit/business-unit/dto/business-unit.create.dto';
import { BusinessUnitUpdateDto } from '@business-unit/business-unit/dto/business-unit.update.dto';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class BusinessUnitServiceMongooseService extends BasicServiceModel<
  BusinessUnitDocument,
  Model<BusinessUnitDocument>,
  BusinessUnitCreateDto,
  BusinessUnitUpdateDto
> {
  constructor(
    @Inject('BUSINESS_UNIT_MODEL_MONGOOSE')
    businessUnitModel: Model<BusinessUnitDocument>,
  ) {
    super(businessUnitModel);
  }
}
