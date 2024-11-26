import { AffiliateServiceMongooseService } from '@affiliate/affiliate';
import { AffiliateCreateDto } from '@affiliate/affiliate/domain/dto/affiliate.create.dto';
import { AffiliateUpdateDto } from '@affiliate/affiliate/domain/dto/affiliate.update.dto';
import { AffiliateDocument } from '@affiliate/affiliate/infrastructure/mongoose/affiliate.schema';
import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import { ResponsePaginator } from '@common/common/interfaces/response-pagination.interface';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigCheckStatsDto } from '@stats/stats/dto/config.check.stats.dto';
import CheckStatsType from '@stats/stats/enum/check.stats.type';
import { TrafficCreateDto } from '@traffic/traffic/dto/traffic.create.dto';
import { TransferInterface } from '@transfer/transfer/entities/transfer.interface';
import EventsNamesBusinessUnitEnum from 'apps/business-unit-service/src/enum/events.names.business.unit.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import EventsNamesTrafficEnum from 'apps/traffic-service/src/enum/events.names.traffic.enum';
import EventsNamesUserEnum from 'apps/user-service/src/enum/events.names.user.enum';
import { isMongoId } from 'class-validator';
import { MoveTrafficAffiliateDto } from './dto/move.traffic.affiliate.dto';
import EventsNamesAffiliateEnum from './enum/events.names.affiliate.enum';

@Injectable()
export class AffiliateServiceService {
  constructor(
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(AffiliateServiceMongooseService)
    private lib: AffiliateServiceMongooseService,
  ) {}

  async getSearchText(
    query: QuerySearchAnyDto,
  ): Promise<ResponsePaginator<AffiliateDocument>> {
    throw new NotImplementedException();
    /* return CommonService.checkSearchText(
      this.lib,
      this.builder,
      EventsNamesAffiliateEnum.updateOne,
      'emitAffiliateEventClient',
      AffiliateProperties,
      query,
    ); */
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getOneByTpId(tpId: any) {
    const affiliates = await this.lib.findAll({
      where: {
        crmIdAffiliate: tpId,
      },
    } as QuerySearchAnyDto);
    const affiliate = affiliates.list[0];
    return {
      idBU: affiliate.businessUnit,
      email: affiliate.personalData.email,
      firstName: affiliate.personalData.name,
      phone: affiliate.personalData.telephone,
      lastName: affiliate.personalData.lastName,
      country: affiliate.personalData.location.country,
    };
  }

  async getAll(query: QuerySearchAnyDto) {
    return await this.lib.findAll(query);
  }

  async newAffiliate(affiliate: AffiliateCreateDto) {
    return this.lib.create(affiliate);
  }

  async newManyAffiliate(createAffiliatesDto: AffiliateCreateDto[]) {
    return this.lib.createMany(createAffiliatesDto);
  }

  async updateAffiliate(affiliate: AffiliateUpdateDto) {
    return this.lib.update(affiliate.id.toString(), affiliate);
  }

  async updateManyAffiliates(affiliates: AffiliateUpdateDto[]) {
    return this.lib.updateMany(
      affiliates.map((affiliate) => affiliate.id.toString()),
      affiliates,
    );
  }

  async deleteAffiliate(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyAffiliates(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async moveTrafficAffiliate(moveAffiliateDto: MoveTrafficAffiliateDto[]) {
    const traffics = [];
    for (const move of moveAffiliateDto) {
      if (!isMongoId(move.affiliate) || !isMongoId(move.brand)) {
        throw new BadRequestException('Must be an ID affiliate and brand');
      }
      // Search affiliate
      const affiliates: ResponsePaginator<AffiliateDocument> =
        await this.lib.findAll({
          relations: ['personalData', 'traffics'],
          where: {
            _id: move.affiliate,
          },
        });
      const affiliate = affiliates.list[0];
      if (!affiliate?._id) {
        throw new BadRequestException('I need the affiliate to move traffic');
      }
      // Search brandTo
      const brand = await this.builder.getPromiseBusinessUnitEventClient(
        EventsNamesBusinessUnitEnum.findOneById,
        move.brand,
      );
      if (!brand?._id) {
        throw new BadRequestException('I need the brand to move the affiliate');
      }
      // Search user
      if (affiliate.personalData?.user) {
        affiliate.personalData.user =
          await this.builder.getPromiseUserEventClient(
            EventsNamesUserEnum.findOneById,
            affiliate.personalData.user,
          );
      } else {
        const users: ResponsePaginator<any> =
          await this.builder.getPromiseUserEventClient<ResponsePaginator<any>>(
            EventsNamesUserEnum.findAll,
            {
              where: {
                email: affiliate.email,
              },
            },
          );
        if (users.list.length == 1) {
          affiliate.personalData.user = users.list[0];
        }
      }

      // Modify old Traffic
      const lastIdxTrafficsAffiliate = affiliate.traffics.length - 1;
      let oldTraffic;
      if (lastIdxTrafficsAffiliate < 0) {
        oldTraffic = await this.builder.getPromiseTrafficEventClient(
          EventsNamesTrafficEnum.findOneById,
          affiliate.currentTraffic,
        );
        if (oldTraffic._id) {
          affiliate.traffics.push(oldTraffic._id);
        }
      } else {
        oldTraffic = await this.builder.getPromiseTrafficEventClient(
          EventsNamesTrafficEnum.findOneById,
          affiliate.traffics[lastIdxTrafficsAffiliate]['id'],
        );
      }
      if (!oldTraffic._id) {
        throw new BadRequestException('I need 1 Traffic');
      }

      // Create next Traffic
      const trafficDto = {
        name: 'Traffic of ' + affiliate.name,
        startDate: new Date(),
        //endDate: new Date(),
        person: affiliate.personalData.id,
        affiliate: affiliate._id,
        businessUnit: brand._id,
        crm: brand.currentCrm?.toString(),
      } as TrafficCreateDto;
      const newTraffic = await this.builder.getPromiseTrafficEventClient(
        EventsNamesTrafficEnum.createOne,
        trafficDto,
      );
      affiliate.crm = brand.currentCrm;
      affiliate.businessUnit = brand._id;
      affiliate.traffics = affiliate.traffics || [];
      affiliate.traffics.push(newTraffic._id);
      affiliate.currentTraffic = newTraffic._id;
      await this.builder.getPromiseTrafficEventClient(
        EventsNamesTrafficEnum.updateOne,
        {
          id: oldTraffic._id,
          endDate: new Date(),
        },
      );
      await affiliate.save();
      traffics.push(newTraffic);
    }
    return traffics;
  }

  async checkStatsAffiliates() {
    const affiliatesBrandToCheck = await this.builder.getPromiseLeadEventClient(
      EventsNamesLeadEnum.getAffiliatesFromLeads,
      [],
    );
    affiliatesBrandToCheck.forEach((group) => {
      this.builder.getPromiseAffiliateEventClient(
        EventsNamesAffiliateEnum.checkAffiliateLeadsStats,
        {
          affiliateId: group._id,
        },
      );
    });
    return affiliatesBrandToCheck;
  }
  async checkStatsForOneAffiliate(affiliateId?: string) {
    if (!affiliateId) {
      let nextPage = 1;
      do {
        const affiliates = await this.getAll({
          page: nextPage,
        });
        for (const affiliate of affiliates.list) {
          this.builder.emitLeadEventClient(
            EventsNamesLeadEnum.checkLeadsForAffiliateStats,
            //EventsNamesLeadEnum.checkLeadsByDateAffiliateStats,
            affiliate._id,
          );
        }
        Logger.debug(
          `Sended Page ${affiliates.currentPage}/${affiliates.lastPage}`,
          'Check all affiliates',
        );
        nextPage = affiliates.nextPage;
      } while (nextPage != 1);
    } else {
      Logger.debug(affiliateId, `${AffiliateServiceService.name}.affiliateId`);
      // TODO[hender - 2024/02/21] Update stats affiliate
      this.builder.emitLeadEventClient(
        EventsNamesLeadEnum.checkLeadsForAffiliateStats,
        affiliateId,
      );
    }
  }

  async checkStatsTransfer(transfer: TransferInterface) {
    Logger.debug(transfer, AffiliateServiceService.name);
    this.checkStats({
      affiliateId: transfer.affiliate,
      checkType: CheckStatsType.LEAD,
    });
  }
  async checkStats(configCheckStats: ConfigCheckStatsDto) {
    switch (configCheckStats.checkType) {
      case CheckStatsType.ALL:
        this.checkStatsLead(configCheckStats);
        break;
      case CheckStatsType.LEAD:
        this.checkStatsLead(configCheckStats);
        break;
      case CheckStatsType.PSP_ACCOUNT:
        throw new NotImplementedException();
    }
  }

  async checkStatsLead(configCheckStats: ConfigCheckStatsDto, page = 1) {
    if (configCheckStats.affiliateId) {
      this.builder.emitLeadEventClient(
        EventsNamesLeadEnum.checkLeadsForAffiliateStats,
        configCheckStats.affiliateId,
      );
    } else {
      const affiliates: ResponsePaginator<AffiliateDocument> =
        await this.lib.findAll({
          page,
        });
      for (const affiliate of affiliates.list) {
        this.builder.emitLeadEventClient(
          EventsNamesLeadEnum.checkLeadsForAffiliateStats,
          affiliate.id,
        );
      }
      if (affiliates.currentPage !== affiliates.lastPage) {
        this.checkStatsLead(configCheckStats, affiliates.nextPage);
      }
    }
  }
  async checkLeadStatuses(affiliateIdList: Array<string>) {
    this.builder.emitLeadEventClient(
      EventsNamesLeadEnum.checkLeadsStatusInCrm,
      affiliateIdList,
    );
    return {
      data: 'Check status in CRM started',
    };
  }
}
