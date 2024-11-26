import {
  IsOptional,
  IsInt,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { AntelopeApiUserResultInterface } from '../interface/antelope.api.user.result.interface';

export class AntelopeApiUserResultDto
  implements AntelopeApiUserResultInterface
{
  // The unique ID of the user ,
  @IsOptional()
  @IsInt()
  userId: number;

  // The email that the user registered with ,
  @IsOptional()
  @IsString()
  email: string;

  // The password that the user registered with (if none was supplied this returns the auto generated password) ,
  @IsOptional()
  @IsString()
  password: string;

  // The first name that the user registered with ,
  @IsOptional()
  @IsString()
  firstName: string;

  // The last name that the user registered with ,
  @IsOptional()
  @IsString()
  lastName: string;

  // The phone number that the user registered with ,
  @IsOptional()
  @IsString()
  telephone: string;

  // The phone prefix that the user registered with (if none was supplied this returns the phone prefix accourding to the country) ,
  @IsOptional()
  @IsString()
  telephonePrefix: string;

  // The country of the user (if none was supplied then the counry is determined by the ip upon registration) ,
  @IsOptional()
  @IsString()
  countryIso: string;

  // The language of the user (if none was supplied then by default 'EN' was selected) ,
  @IsOptional()
  @IsString()
  languageIso: string;

  // The type of device used upon registeration = ['Android', 'iOS', 'Web'],
  @IsOptional()
  @IsString()
  deviceType: string;

  // The ip that was recorded on registration ,
  @IsOptional()
  @IsString()
  ip: string;

  // The id of the broker that the user registered with ,
  @IsOptional()
  @IsInt()
  brokerId: number;

  // The name of the broker that the user registered with ,
  @IsOptional()
  @IsString()
  brokerName: string;

  // The url of the brokers site ,
  @IsOptional()
  @IsString()
  brokerUrl: string;

  // The Logo for the broker the user registered with ,
  @IsOptional()
  @IsString()
  brokerLogoUrl: string;

  // Automatic login url, sends user to broker in 'logged in' state ,
  @IsOptional()
  @IsString()
  brokerLoginUrl: string;

  // The balance of the user at the broker ,
  @IsOptional()
  @IsNumber()
  brokerBalance: number;

  // The sales status of the user at the broker = ['New', 'NoAnswer', 'Converted', 'CallBack', 'Interested', 'NotInterested', 'WrongInfo', 'DoNotCall', 'NotAvalible'],
  @IsOptional()
  @IsString()
  brokerSalesStatus: string;

  // User registration date ,
  @IsOptional()
  @IsString()
  registrationDate: string;

  // user has FTD true or false ,
  @IsOptional()
  @IsBoolean()
  hasFTD: boolean;

  // user kyc status ,
  @IsOptional()
  @IsString()
  kycStatus: string;

  // user fns status
  @IsOptional()
  @IsString()
  fnsStatus: string;
}
