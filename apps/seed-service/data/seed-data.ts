import mongoose from 'mongoose';
import { CountryCode } from 'libphonenumber-js';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';

const crmOne = new mongoose.Types.ObjectId();
const affiliateOne = new mongoose.Types.ObjectId();
const affiliateTwo = new mongoose.Types.ObjectId();
const statusOne = new mongoose.Types.ObjectId();
const personUpdateOne = new mongoose.Types.ObjectId();
const personUpdateTwo = new mongoose.Types.ObjectId();
const statsLeadOne = new mongoose.Types.ObjectId();

const brandsId = [{ id: new mongoose.Types.ObjectId() }];

const arrayObjectLeads = [
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
  { id: new mongoose.Types.ObjectId() },
];

interface SeedLead {
  id: any;
  name: string;
  crmIdLead: number;
  description: string;
  referral: string;
  referralType: string;
  password: string;
  crm: any;
  affiliate: any;
}

interface SeedBusinessUnit {
  id: any;
  name: string;
  description: string;
  crmList: any[];
  affiliates: any[];
}

interface SeedStatsLead {
  email: string;
  affiliate: any;
  status: any;
  country: CountryCode;
  insertDate: Date;
  ftdDate?: Date;
  lead: any;
}

interface SeedStatsAffiliate {
  name: string;
  leads: number;
  ftd: number;
  cftd: number;
  totalFtd: number;
  affiliateConvertion: number;
  realConvertion: number;
  brands: any[];
  countries: CountryCode[];
  rateconvertion: number;
  newleads: number;
  affiliate: any;
}

interface SeedCrm {
  id: any;
  name: string;
  description: string;
  status: any;
}

interface SeedAffiliate {
  id: any;
  name: string;
  description: string;
  convertionCost: number;
  personalData: any;
  crm: any;
  user: any;
}

interface SeedUserRegister {
  password: string;
  confirmPassword: string;
  email: string;
  description: string;
  name: string;
  active: boolean;
  role?: any;
}

interface SeedData {
  users: SeedUserRegister[];
  leads: SeedLead[];
  affiliates: SeedAffiliate[];
  crms: SeedCrm[];
  statsLeads: SeedStatsLead[];
  statsAffiliates: SeedStatsAffiliate[];
  businessUnits: SeedBusinessUnit[];
}

export const initialData: SeedData = {
  users: [
    {
      password: 'Abc123',
      confirmPassword: 'Abc123',
      email: 'test1@google.com',
      description: 'Aliquip ad occaecat nisi eu sit tempor aliquip.',
      name: 'Test User',
      active: true,
    },
    {
      password: 'Abc123',
      confirmPassword: 'Abc123',
      email: 'test2@google.com',
      description: 'Aliquip ad occaecat nisi eu sit tempor aliquip.',
      name: 'Test Two User',
      active: true,
    },
  ],
  leads: [
    {
      id: arrayObjectLeads[0].id,
      name: 'Fabio Perez',
      crmIdLead: 1,
      description:
        'Consectetur deserunt laborum ullamco reprehenderit fugiat aliquip ea.',
      referralType: 'FACEBOOK',
      referral: 'http://facebook.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[1].id,
      name: 'Camila Gonzalez',
      crmIdLead: 2,
      description:
        'Irure dolor velit dolor quis excepteur quis est voluptate sunt duis amet cupidatat mollit dolore.',
      referralType: 'FACEBOOK',
      referral: 'http://facebook.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[2].id,
      name: 'Ricardo Lopez',
      crmIdLead: 3,
      description:
        'Cupidatat ipsum labore ipsum proident velit non nulla velit fugiat eiusmod consequat ea officia velit.',
      referralType: 'GOOGLE',
      referral: 'http://google.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[3].id,
      name: 'Felipe Ochoa',
      crmIdLead: 4,
      description: 'Proident adipisicing adipisicing mollit ut anim.',
      referralType: 'GOOGLE',
      referral: 'http://google.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[4].id,
      name: 'Patricia Gomez',
      crmIdLead: 5,
      description: 'Ipsum eu eu esse proident.',
      referralType: 'GOOGLE',
      referral: 'http://google.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[5].id,
      name: 'Felipe castro',
      crmIdLead: 6,
      description:
        'Dolor aliqua aliqua deserunt voluptate aute nulla ea exercitation.',
      referralType: 'WEB_PERSONAL',
      referral: 'http://web-personal_felipe.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[6].id,
      name: 'Karim Benzema',
      crmIdLead: 7,
      description:
        'Cillum do proident duis nostrud ad anim eiusmod id id eiusmod est fugiat cupidatat.',
      referralType: 'WEB_PERSONAL',
      referral: 'http://web-personal_karim.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[7].id,
      name: 'Nicola Tesla',
      crmIdLead: 8,
      description: 'Nulla officia adipisicing adipisicing elit aute..',
      referralType: 'WEB_PERSONAL',
      referral: 'http://web-personal_felipe.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateTwo,
    },
    {
      id: arrayObjectLeads[8].id,
      name: 'Robert Ky',
      crmIdLead: 9,
      description: 'Duis incididunt non mollit cupidatat ullamco consectetur.',
      referralType: 'FACEBOOK',
      referral: 'http://facebook.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateTwo,
    },
    {
      id: arrayObjectLeads[9].id,
      name: 'Richard P',
      crmIdLead: 10,
      description:
        'Ullamco anim elit velit consequat proident ipsum id ut culpa esse.',
      referralType: 'FACEBOOK',
      referral: 'http://facebook.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[10].id,
      name: 'Altair Bermudez',
      crmIdLead: 11,
      description:
        'Aute ex aliquip pariatur culpa laborum amet ea qui cupidatat mollit deserunt.',
      referralType: 'FACEBOOK',
      referral: 'http://facebook.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[11].id,
      name: 'Kratos Pancracio',
      crmIdLead: 12,
      description: 'Tempor quis non sunt nulla ipsum nostrud ex.',
      referralType: 'CAMPAIGN_NEW',
      referral: 'http://campaign-url.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[12].id,
      name: 'Karen Martinez',
      crmIdLead: 13,
      description:
        'Adipisicing enim deserunt non do sint do duis aliqua Lorem.',
      referralType: 'GOOGLE',
      referral: 'http://google.com',
      password: 'Pass12345',
      crm: crmOne,
      affiliate: affiliateOne,
    },
    {
      id: arrayObjectLeads[13].id,
      name: 'Esperanza Gomez',
      crmIdLead: 14,
      description: 'Id et laboris pariatur id proident.',
      referralType: 'WEB_PERSONAL',
      referral: 'http://web-personal_esperanza.com',
      crm: crmOne,
      password: 'Pass12345',
      affiliate: affiliateTwo,
    },
  ],
  affiliates: [
    {
      id: affiliateOne,
      name: 'MegaGlobal Patner',
      description:
        'Aliqua excepteur pariatur ex esse nulla laboris duis do irure id do Lorem.',
      convertionCost: 0.1,
      personalData: personUpdateOne,
      crm: crmOne,
      user: null,
    },
    {
      id: affiliateTwo,
      name: 'Super Sell',
      description:
        'Deserunt cillum ea nulla magna cillum mollit sint aliqua ex.',
      convertionCost: 0.5,
      personalData: personUpdateTwo,
      crm: crmOne,
      user: null,
    },
  ],
  crms: [
    {
      id: crmOne,
      name: 'NoInmarket',
      description:
        'Cillum esse eiusmod cillum esse exercitation incididunt culpa qui in nulla qui exercitation dolore ex.',
      status: statusOne,
    },
  ],
  statsLeads: [
    {
      email: 'fabioperez@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[0].id,
    },
    {
      email: 'camilagonzalez@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[1].id,
    },
    {
      email: 'ricardoLopez@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[2].id,
    },
    {
      email: 'felipeochoa@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[3].id,
    },
    {
      email: 'patriciagomez@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[4].id,
    },
    {
      email: 'felipecastro@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[5].id,
    },
    {
      email: 'karinbenzama@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[6].id,
    },
    {
      email: 'nicolatesla@google.com',
      affiliate: affiliateTwo,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[7].id,
    },
    {
      email: 'robertky@google.com',
      affiliate: affiliateTwo,
      status: statusOne,
      country: CountryCodeEnum.Mexico,
      insertDate: new Date(),
      lead: arrayObjectLeads[8].id,
    },
    {
      email: 'richardp@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Colombia,
      insertDate: new Date(),
      lead: arrayObjectLeads[9].id,
    },
    {
      email: 'altairbermudez@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Colombia,
      insertDate: new Date(),
      lead: arrayObjectLeads[10].id,
    },
    {
      email: 'kratospancracio@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Colombia,
      insertDate: new Date(),
      lead: arrayObjectLeads[11].id,
    },
    {
      email: 'karenmartinez@google.com',
      affiliate: affiliateOne,
      status: statusOne,
      country: CountryCodeEnum.Colombia,
      insertDate: new Date(),
      lead: arrayObjectLeads[12].id,
    },
    {
      email: 'esperanzagomez@google.com',
      affiliate: affiliateTwo,
      status: statusOne,
      country: CountryCodeEnum.Colombia,
      insertDate: new Date(),
      lead: arrayObjectLeads[13].id,
    },
  ],
  statsAffiliates: [
    {
      name: 'MegaGlobal Patner',
      leads: 11,
      ftd: 3,
      cftd: 5,
      totalFtd: 8,
      affiliateConvertion: 0.27,
      realConvertion: 0.72,
      brands: [brandsId[0].id],
      countries: [CountryCodeEnum.Mexico, CountryCodeEnum.Colombia],
      rateconvertion: 0,
      newleads: 34,
      affiliate: affiliateOne,
    },
  ],
  businessUnits: [
    {
      id: brandsId[0].id,
      name: 'Mega Affiliates',
      description:
        'Anim consequat labore ex cillum aliqua minim nulla sunt non elit id fugiat Lorem sunt.',
      crmList: [crmOne],
      affiliates: [affiliateOne],
    },
  ],
};
