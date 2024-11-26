export interface AntelopeApiUserResultInterface {
  // The unique ID of the user
  userId: number;

  // The email that the user registered with
  email: string;

  // The password that the user registered with (if none was supplied this returns the auto generated password)
  password: string;

  // The first name that the user registered with
  firstName: string;

  // The last name that the user registered with
  lastName: string;

  // The phone number that the user registered with
  telephone: string;

  // The phone prefix that the user registered with (if none was supplied this returns the phone prefix accourding to the country)
  telephonePrefix: string;

  // The country of the user (if none was supplied then the counry is determined by the ip upon registration)
  countryIso: string;

  // The language of the user (if none was supplied then by default 'EN' was selected)
  languageIso: string;

  // The type of device used upon registeration = ['Android', 'iOS', 'Web']
  deviceType: string;

  // The ip that was recorded on registration
  ip: string;

  // The id of the broker that the user registered with
  brokerId: number;

  // The name of the broker that the user registered with
  brokerName: string;

  // The url of the brokers site
  brokerUrl: string;

  // The Logo for the broker the user registered with
  brokerLogoUrl: string;

  // Automatic login url, sends user to broker in 'logged in' state
  brokerLoginUrl: string;

  // The balance of the user at the broker
  brokerBalance: number;

  // The sales status of the user at the broker = ['New', 'NoAnswer', 'Converted', 'CallBack', 'Interested', 'NotInterested', 'WrongInfo', 'DoNotCall', 'NotAvalible']
  brokerSalesStatus: string;

  // User registration date
  registrationDate: string;

  // user has FTD true or false
  hasFTD: boolean;

  // user kyc status
  kycStatus: string;

  // user fns status
  fnsStatus: string;
}
