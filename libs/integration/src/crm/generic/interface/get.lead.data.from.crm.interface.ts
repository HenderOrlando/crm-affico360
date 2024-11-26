import { UserResponseDto } from '../dto/user.response.dto';

export interface GetLeadDataFromCRMInterface {
  getLeadDataFromCRM(lead: any): UserResponseDto;
}
