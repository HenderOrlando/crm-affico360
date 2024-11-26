import { LeadAccountResponseDto } from '../../generic/dto/lead.account.response.dto';
import { CodeResponseLeverateEnum } from './result.response.leverate.dto';

export interface LeadAccountDetailsResponse extends LeadAccountResponseDto {
  getAccountDetailsAccountInfo: GetAccountDetailsAccountInfo;
  tpAccountInfo: Array<TpAccountInfo>;
  result: ResultInfo;
}
interface GetAccountDetailsAccountInfo {
  lv_ip: string;
  lv_dateofbirth: string;
  lv_securities: PickListInfo;
  lv_currencies: PickListInfo;
  lv_futures: PickListInfo;
  lv_additionalinfo2: string;
  lv_additionalinfo3: string;
  lv_accepttermsandconditions: boolean;
  lv_suppliednecessarydocuments: boolean;
  lv_promotioncode: string;
  lv_sourceid: string;
  lv_language: string;
  lv_sumofdeposits: number;
  lv_utmcreative: string;
  accountType: PickListInfo;
  address1: string;
  city: string;
  address1_country: string;
  email: string;
  browser: string;
  accountid: string;
  firstName: string;
  lastName: string;
  affiliate: string;
  campaignId: string;
  subAffiliate: string;
  referrer: string;
  tag1: string;
  owningBusinessUnit: string;
  phoneCountryCode: string;
  phoneNumber: string;
  state: string;
  title: PickListInfo;
  zipCode: string;
  address1_primarycontactname: string;
  industrycode: PickListInfo;
  createdon: string;
  tcPermissions: boolean;
  country_short: string;
  country: string;
  lv_countryofcitizenship: string;
  lv_isusresident: Lv_isusresidentEnum;
  brandName: string;
  leadStatus: PickListInfo;
}
interface TpAccountInfo {
  lv_tpaccountid: string;
  lastLoginTime: string;
  tp_name: string;
  lv_tradingplatformid: string;
  type: TypeTpAccountInfoEnum;
  tradingplatform_name: string;
  symbol: string;
  code: string;
  lv_webtraderenvId: string;
  lv_webtraderurl: string;
}
interface ResultInfo {
  requestId: string;
  code: CodeResponseLeverateEnum;
  //,
  message: string;
}
interface PickListInfo {
  name: string;
  value: number;
}

enum TypeTpAccountInfoEnum {
  demo = 'Demo',
  real = 'Real',
}

enum Lv_isusresidentEnum {
  //['Empty', 'NeverReplied', 'Yes', 'No']
  empty = 'Empty',
  never_replied = 'NeverReplied',
  yes = 'Yes',
  no = 'No',
}
