import { ObjectId } from 'mongoose';

export class CheckLeadStatusOnCrmDto {
  leadsToCheck: Array<ObjectId>;
  affiliatesToCheck: Array<ObjectId>;
  start?: Date;
  end?: Date;
}
