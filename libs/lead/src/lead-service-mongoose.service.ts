import { AffiliateServiceMongooseService } from '@affiliate/affiliate';
import { BuildersService } from '@builder/builders';
import dbIntegrationEnum from '@builder/builders/enums/db-integration.enum';
import { BusinessUnitServiceMongooseService } from '@business-unit/business-unit';
import { BusinessUnitDocument } from '@business-unit/business-unit/entities/mongoose/business-unit.schema';
import { CategoryServiceMongooseService } from '@category/category';
import { CategoryDocument } from '@category/category/entities/mongoose/category.schema';
import { CommonService } from '@common/common';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { BasicServiceModel } from '@common/common/models/basic-service.model';
import { CrmServiceMongooseService } from '@crm/crm';
import { CrmDocument } from '@crm/crm/entities/mongoose/crm.schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PersonServiceMongooseService } from '@person/person';
import { PersonDocument } from '@person/person/entities/mongoose/person.schema';
import { StatusServiceMongooseService } from '@status/status';
import { StatusDocument } from '@status/status/entities/mongoose/status.schema';
import { Model, isValidObjectId } from 'mongoose';
import { AffiliateDocument } from '../../affiliate/src/infrastructure/mongoose/affiliate.schema';
import { PersonCreateDto } from '../../person/src/dto/person.create.dto';
import { LeadCreateDto } from './dto/lead.create.dto';
import { LeadUpdateDto } from './dto/lead.update.dto';
import { Lead, LeadDocument } from './entities/mongoose/lead.schema';

@Injectable()
export class LeadServiceMongooseService extends BasicServiceModel<
  LeadDocument,
  Model<LeadDocument>,
  LeadCreateDto,
  LeadUpdateDto
> {
  constructor(
    @Inject(BuildersService)
    private builder: BuildersService,
    @Inject('LEAD_MODEL_MONGOOSE')
    private leadModel: Model<LeadDocument>,
    @Inject(StatusServiceMongooseService)
    private statusService: StatusServiceMongooseService,
    @Inject(PersonServiceMongooseService)
    private personService: PersonServiceMongooseService,
    @Inject(AffiliateServiceMongooseService)
    private affiliateService: AffiliateServiceMongooseService,
    @Inject(BusinessUnitServiceMongooseService)
    private businessUnitService: BusinessUnitServiceMongooseService,
    @Inject(CrmServiceMongooseService)
    private crmService: CrmServiceMongooseService,
    @Inject(CategoryServiceMongooseService)
    private categoryService: CategoryServiceMongooseService,
  ) {
    super(leadModel);
  }

  async findAll(query) {
    if (!query?.relations || query?.relations.indexOf('affiliate') < 0) {
      query = query || {};
      query.relations = query.relations || [];
      if (query?.relations?.indexOf('brand') < 0) {
        query.relations.push('brand');
      }
      if (query?.relations?.indexOf('affiliate') < 0) {
        query.relations.push('affiliate');
      }
    }
    const list = await super.findAll(query);

    // TODO[hender - 2024/02/24] Remove when added integration group
    list.list = list.list.map((lead) => {
      if (
        lead.brand?.name &&
        lead.affiliate?.name.indexOf(lead.brand.name) < 0
      ) {
        lead.affiliate.name = lead.affiliate.name + ' - ' + lead.brand.name;
      }
      // TODO[hender - 2024/06/13] Check the affiliate to add prefix
      if (
        lead.affiliate?.name &&
        lead.affiliate?.name.indexOf('internal') < 0
      ) {
        let prefix = 'ANG';
        if (lead.brand?.slug === 'fintavest') {
          prefix = 'STELLA';
        }
        if (lead.affiliate?.name.indexOf(prefix) < 0) {
          lead.affiliate.name = lead.affiliate.name + ` ${prefix}`;
        }
      }
      // TODO[hender - 2024/06/13] Change lead statuses in Fintavest
      if (lead.brand?.slug === 'fintavest') {
        if (lead?.status?.slug) {
          const splitSlug = lead?.status?.slug.split('-');
          let newName = '';
          for (let i = 1; i < splitSlug.length; i++) {
            newName += CommonService.camelize(` ${splitSlug[i]}`, true);
          }
          lead.status.name = newName.trim();
          if (lead.status.name === 'Nan') {
            lead.status.name = 'NoAnswer';
          } else if (lead.status.name === 'Dnd') {
            lead.status.name = 'WrongNumber';
          } else if (lead.status.name.indexOf('NoLink') > -1) {
            lead.status.name = 'NoLine';
          } else if (lead.status.name === 'ZeroContact') {
            lead.status.name = 'VoiceMail';
          }
        }
      }
      return lead;
    });
    return list;
  }

  async update(id: string, updateLeadDto: LeadUpdateDto) {
    const referralType = await this.validateReferralTypeLead(
      updateLeadDto.referralType,
    );
    updateLeadDto.referralType = referralType?._id;
    const rta = await super.update(id, updateLeadDto);
    if (rta._id) {
      return this.updateSearchText(id);
    }
    return rta;
  }

  async updateSearchText(id: string): Promise<LeadDocument> {
    const lead = await this.getLeadData(id);
    lead.searchText = this.getSearchText(lead);
    return await super.update(id, {
      searchText: lead?.searchText,
      id: lead.id,
    });
  }

  async getLeadData(id: string): Promise<Lead> {
    const leads = await this.findAll({
      where: {
        _id: id,
      },
      relations: [
        'affiliate',
        'brand',
        'crm',
        'personalData',
        'status',
        'referralType',
        'crmDepartment',
      ],
    });
    return leads.list[0];
  }

  async createMany(createAnyDto: LeadCreateDto[]): Promise<LeadDocument[]> {
    if (this.nameOrm === dbIntegrationEnum.MONGOOSE) {
      const promises = [];
      for (const dto of createAnyDto) {
        const lead: Lead = { ...dto } as unknown as Lead;
        // Check Referral_type
        lead.referralType = await this.validateReferralTypeLead(
          dto.referralType,
        );
        // Check Person
        let person: PersonDocument;
        if (isValidObjectId(dto.personalData)) {
          person = await this.personService.findOne(
            dto.personalData.toString(),
          );
        } else {
          const persons: ResponsePaginator<PersonDocument> =
            await this.personService.findAll({
              relations: ['user'],
              where: {
                email: {
                  $in: [dto.personalData?.email ?? dto.email],
                },
              },
            });
          person = persons.list[0];
        }
        //let user: UserDocument;
        if (!person?.id) {
          // No Person finded. Create Person
          dto.personalData = dto.personalData || new PersonCreateDto();
          dto.personalData.firstName = dto.personalData?.firstName ?? dto.name;
          dto.personalData.email =
            dto.personalData?.email ||
            (dto.personalData?.emails && dto.personalData?.emails[0]) ||
            dto.email;
          person = await this.personService.create(dto.personalData);
          // Create User
          //user = await this.userService.create(dto.user);
          //user.personalData = person;
          //person.user = user;
          //await person.save();
          //await user.save();
        } else {
          // Person finded. Update name and email of Person
          person.name = person.name || dto.user?.name || dto.name;
          person.email = person.email || [];
          const existEmail = !!person.email.find(
            (elem) => elem === dto.user?.email,
          );
          if (!existEmail) {
            person.email.push(dto.user?.email);
          }
          await person.save();
        }
        // TODO[hender] Every user have personalData && All person have unique user
        /*if (!person.user) {
          throw new BadRequestException('The person have not user asociated');
        }*/
        lead.personalData = person;
        //lead.user = person.user;
        // Check AFFILIATE
        const affiliate: AffiliateDocument =
          await this.affiliateService.findOne(dto.affiliate);
        lead.affiliate = affiliate;
        // Check CRM
        const crmId = (dto.crm || affiliate.crm).toString();
        if (!crmId) {
          throw new BadRequestException("The Crm isn't valid");
        }
        const crm: CrmDocument = await this.crmService.findOne(
          crmId.id ?? crmId,
        );
        lead.crm = crm;

        // Check BusinessUnit
        const brandId = dto.brand || affiliate.businessUnit;
        if (!brandId) {
          throw "The Brand isn't valid";
        }
        const brand: BusinessUnitDocument =
          await this.businessUnitService.findOne(brandId);
        lead.brand = brand;

        // Search Status
        const statuses: ResponsePaginator<StatusDocument> =
          await this.statusService.findAll({
            where: {
              name: new RegExp('G - New', 'ig'),
            },
          });
        const status: StatusDocument = statuses.list[0];
        if (!status?.id) {
          throw new BadRequestException('Not found the status "Active"');
        }
        lead.status = status;

        // Added searchtext
        lead.searchText = this.getSearchText(lead);

        lead.crmDepartment = lead.crmDepartment ?? brand.department;
        const crmDepartment: ResponsePaginator<CategoryDocument> =
          await this.categoryService.findAll({
            where: {
              _id: lead.crmDepartment,
            },
          });
        if (!crmDepartment.totalElements) {
          throw new NotFoundException('Need if lead is retention or sales');
        }
        lead.crmDepartment = crmDepartment.list[0];

        const leadSaved = await this.model.create(lead);
        //brand.leads.push(leadSaved);
        //user.apiKey = affiliateSaved.publicKey;
        person.leads = person.leads ?? [];
        person.leads.push(leadSaved.id);
        //user.affiliates.push(affiliateSaved);
        //crm.leads = crm.leads ?? [];
        //crm.leads.push(leadSaved.id);
        //await brand.save();
        await person.save();
        //user.save();
        //await crm.save();
        // Create lead
        promises.push(leadSaved);
      }
      return promises;
    }
    return this.model.save(createAnyDto);
  }

  private async validateReferralTypeLead(
    referralType: string,
    required = false,
  ) {
    let where = {};
    if (isValidObjectId(referralType)) {
      where = {
        _id: referralType,
      };
    } else if (typeof referralType === 'string' && referralType.length == 3) {
      where = {
        valueText: referralType,
      };
    } else if (typeof referralType === 'number') {
      where = {
        valueNumber: referralType,
      };
    } else {
      if (required) {
        throw new BadRequestException('Wrong referral type');
      }
    }
    if (Object.keys(where).length) {
      const referrals: ResponsePaginator<CategoryDocument> =
        await this.categoryService.findAll({
          where: where,
        });
      if (referrals.list.length != 1) {
        throw new BadRequestException('Referral must by only one');
      }
      return referrals.list[0];
    }
    return null;
  }

  getSearchText(lead: Lead) {
    return (
      lead.country +
      CommonService.getSeparatorSearchText() +
      lead.docId +
      CommonService.getSeparatorSearchText() +
      lead.email +
      CommonService.getSeparatorSearchText() +
      lead.firstname +
      CommonService.getSeparatorSearchText() +
      lead.id +
      CommonService.getSeparatorSearchText() +
      lead.lastname +
      CommonService.getSeparatorSearchText() +
      lead.name +
      CommonService.getSeparatorSearchText() +
      lead.password +
      CommonService.getSeparatorSearchText() +
      lead.phone +
      CommonService.getSeparatorSearchText() +
      lead.slug +
      CommonService.getSeparatorSearchText() +
      lead.telephone +
      CommonService.getSeparatorSearchText() +
      lead.MPC_10 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_11 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_12 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_1 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_2 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_3 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_4 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_5 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_6 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_7 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_8 +
      CommonService.getSeparatorSearchText() +
      lead.MPC_9 +
      CommonService.getSeparatorSearchText() +
      lead.campaign +
      CommonService.getSeparatorSearchText() +
      lead.ad +
      CommonService.getSeparatorSearchText() +
      lead.ai +
      CommonService.getSeparatorSearchText() +
      lead.ci +
      CommonService.getSeparatorSearchText() +
      lead.country +
      CommonService.getSeparatorSearchText() +
      lead.crmAccountIdLead +
      CommonService.getSeparatorSearchText() +
      lead.crmAccountPasswordLead +
      CommonService.getSeparatorSearchText() +
      lead.crmDepartment?.searchText +
      CommonService.getSeparatorSearchText() +
      lead.crmIdLead +
      CommonService.getSeparatorSearchText() +
      lead.crmTradingPlatformAccountId +
      CommonService.getSeparatorSearchText() +
      lead.description +
      CommonService.getSeparatorSearchText() +
      lead.gi +
      CommonService.getSeparatorSearchText() +
      lead.medium +
      CommonService.getSeparatorSearchText() +
      lead.referral +
      CommonService.getSeparatorSearchText() +
      lead.so +
      CommonService.getSeparatorSearchText() +
      lead.sub +
      CommonService.getSeparatorSearchText() +
      lead.keywords +
      CommonService.getSeparatorSearchText() +
      lead.sourceId +
      CommonService.getSeparatorSearchText() +
      lead.userIp +
      CommonService.getSeparatorSearchText() +
      lead.referralType?.searchText +
      CommonService.getSeparatorSearchText() +
      lead.status?.searchText +
      CommonService.getSeparatorSearchText() +
      lead.affiliate?.searchText +
      CommonService.getSeparatorSearchText() +
      lead.brand?.searchText +
      CommonService.getSeparatorSearchText() +
      lead.crm?.searchText +
      CommonService.getSeparatorSearchText() +
      lead.personalData?.searchText
    );
  }
}
