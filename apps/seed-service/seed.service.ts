import { ActivityServiceMongooseService } from '@activity/activity';
import { AffiliateServiceMongooseService } from '@affiliate/affiliate';
import { BuildersService } from '@builder/builders';
import { BusinessUnitServiceMongooseService } from '@business-unit/business-unit';
import { CategoryServiceMongooseService } from '@category/category';
import { CrmServiceMongooseService } from '@crm/crm';
import { LeadServiceMongooseService } from '@lead/lead';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PermissionServiceMongooseService } from '@permission/permission';
import { PersonServiceMongooseService } from '@person/person';
import { PspAccountServiceMongooseService } from '@psp-account/psp-account';
import { PspServiceMongooseService } from '@psp/psp';
import { RoleServiceMongooseService } from '@role/role';
import {
  StatsDateAffiliateServiceMongooseService,
  StatsDatePspAccountServiceMongooseService,
} from '@stats/stats';
import { StatusServiceMongooseService } from '@status/status';
import { TrafficServiceMongooseService } from '@traffic/traffic';
import { TransferServiceMongooseService } from '@transfer/transfer';
import { UserServiceMongooseService } from '@user/user';
import creator from './data/initial-data';

@Injectable()
export class SeedService {
  private eventClient: ClientProxy;
  constructor(
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    private readonly transferRepo: TransferServiceMongooseService,
    private readonly activityRepo: ActivityServiceMongooseService,
    private readonly roleRepo: RoleServiceMongooseService,
    private readonly permissionRepo: PermissionServiceMongooseService,
    private readonly brandRepo: BusinessUnitServiceMongooseService,
    private readonly crmRepo: CrmServiceMongooseService,
    private readonly pspRepo: PspServiceMongooseService,
    private readonly pspAccountRepo: PspAccountServiceMongooseService,
    private readonly categoryRepo: CategoryServiceMongooseService,
    private readonly userRepo: UserServiceMongooseService,
    private readonly statusRepo: StatusServiceMongooseService,
    private readonly affiliateRepo: AffiliateServiceMongooseService,
    private readonly trafficRepo: TrafficServiceMongooseService,
    private readonly personRepo: PersonServiceMongooseService,
    private readonly leadRepo: LeadServiceMongooseService,
    private readonly statsDateAffiliatesRepo: StatsDateAffiliateServiceMongooseService,
    private readonly statsDatePspAccountsRepo: StatsDatePspAccountServiceMongooseService,
  ) {
    creator.setBuilder(this.builder);
  }

  async saveInitialData() {
    const countCrm = await this.crmRepo.count();
    const countPsp = await this.pspRepo.count();
    const countUsers = await this.userRepo.count();
    const countRoles = await this.roleRepo.count();
    const countLeads = await this.leadRepo.count();
    const countBrand = await this.brandRepo.count();
    const countTraffic = await this.trafficRepo.count();
    const countTransfers = await this.transferRepo.count();
    const countStatuses = await this.statusRepo.count();
    const countCategories = await this.categoryRepo.count();
    const countAffiliates = await this.affiliateRepo.count();
    const countPspAccount = await this.pspAccountRepo.count();
    const countPermissions = await this.permissionRepo.count();

    if (
      !countCrm ||
      !countPsp ||
      !countUsers ||
      !countRoles ||
      !countLeads ||
      !countBrand ||
      !countTraffic ||
      !countStatuses ||
      !countPspAccount ||
      !countCategories ||
      !countAffiliates ||
      !countPermissions ||
      !countTransfers
    ) {
      await this.clearStats();
      await this.clearActivities();
      await this.clearPersons();
      await this.seedStatus();
      await this.seedCategory();
      await this.seedPermissions();
      await this.seedRoles();
      await this.seedBrands();
      await this.seedCrm();
      await this.seedUsers();
      await this.seedPsps();
      await this.seedPspAccounts();
      await this.seedAffiliates();
      await this.seedLeads();
      await this.seedTransfers();
    }
    return {
      statusCode: 200,
      msg: 'Seeds loaded',
    };
  }

  async clearStats() {
    Logger.log('Clear stats...', SeedService.name);
    return Promise.all([
      this.statsDatePspAccountsRepo.clear(),
      this.statsDateAffiliatesRepo.clear(),
    ]);
  }
  async clearActivities() {
    Logger.log('Clear activities...', SeedService.name);
    return this.activityRepo.clear();
  }
  async clearStatus() {
    Logger.log('Clear status...', SeedService.name);
    return this.statusRepo.clear();
  }
  async clearCategories() {
    Logger.log('Start seed categories...', SeedService.name);
    return this.categoryRepo.clear();
  }
  async clearPermissions() {
    // Clear Permissions
    Logger.log('Clear permissions...', SeedService.name);
    return this.permissionRepo.clear();
  }
  async clearRoles() {
    // Clear Roles
    Logger.log('Clear roles...', SeedService.name);
    return this.roleRepo.clear();
  }
  async clearBrands() {
    // Clear Brands
    Logger.log('Clear brands...', SeedService.name);
    return this.brandRepo.clear();
  }
  async clearCrms() {
    // Clear Crms
    Logger.log('Clear crms...', SeedService.name);
    return this.crmRepo.clear();
  }
  async clearPersons() {
    // Clear Persons
    Logger.log('Clear persons...', SeedService.name);
    return this.personRepo.clear();
  }
  async clearUsers() {
    // Clear Users
    Logger.log('Clear users...', SeedService.name);
    return this.userRepo.clear();
  }
  async clearPsps() {
    // Clear Psps
    Logger.log('Clear psps...', SeedService.name);
    return this.pspRepo.clear();
  }
  async clearPspAccounts() {
    // Clear Psps Account
    Logger.log('Clear psps account...', SeedService.name);
    return this.pspAccountRepo.clear();
  }
  async clearTraffic() {
    // Clear Traffic
    Logger.log('Clear traffic...', SeedService.name);
    return this.trafficRepo.clear();
  }
  async clearAffiliates() {
    // Clear Affiliates
    Logger.log('Clear affiliate...', SeedService.name);
    return this.affiliateRepo.clear();
  }
  async clearLeads() {
    // Clear Leads
    Logger.log('Clear lead...', SeedService.name);
    return this.leadRepo.clear();
  }
  async clearTransfers() {
    // Clear Transfers
    Logger.log('Clear transfers...', SeedService.name);
    return this.transferRepo.clear();
  }

  async seedStatus() {
    this.clearStatus();
    // Create Status
    Logger.log('Saving status...', SeedService.name);
    return creator.createInitialStatusDataList();
  }

  async seedCategory() {
    this.clearCategories();
    Logger.log('Saving categories...', SeedService.name);
    return Promise.all([
      // Create Category/Categories
      await creator.createInitialCategoryDataList(),
      // Create Category/Departments
      await creator.createInitialCategoryDepartmentDataList(),
      // Create Category/SourcesType
      await creator.createInitialCategoryReferralTypeDataList(),
      // Create Category/MonetaryTransactionType
      await creator.createInitialCategoryMonetaryTransactionDataList(),
      // Create Category/Crm (Antelope and Leverate)
      await creator.createInitialCategoryCrmDataList(),
      // Create Category/Rules
      await creator.createInitialCategoryRuleDataList(),
      // Create Category/Countries
      await creator.createInitialCategoryCountryDataList(),
      // Create Category/Currency
      await creator.createInitialCategoryCurrencyDataList(),
      // Create Category/Bank
      await creator.createInitialCategoryBankDataList(),
    ]);
  }

  async seedPermissions() {
    this.clearPermissions();
    // Create Permissions
    Logger.log('Saving permissions...', SeedService.name);
    return creator.createInitialPermissionDataList();
  }

  async seedRoles() {
    this.clearRoles();
    // Create Roles
    Logger.log('Saving roles...', SeedService.name);
    return creator.createInitialRoleDataList();
  }

  async seedBrands() {
    this.clearBrands();
    // Create Brands
    Logger.log('Saving brands...', SeedService.name);
    return creator.createInitialBrandDataList();
  }
  async seedCrm() {
    await this.clearCrms();
    // Create Crms
    Logger.log('Saving crms...', SeedService.name);
    return creator.createInitialCrmDataList();
  }
  async seedUsers() {
    await this.clearUsers();
    // Create Users
    Logger.log('Saving superadmin...', SeedService.name);
    return creator.createInitialUserDataList();
  }
  async seedPsps() {
    await this.clearPsps();
    // Create Psps
    Logger.log('Saving psp...', SeedService.name);
    return creator.createInitialPspDataList();
  }
  async seedPspAccounts() {
    await this.clearPspAccounts();
    // Create Psps
    Logger.log('Saving psp account...', SeedService.name);
    return creator.createInitialPspAccountDataList();
  }
  async seedAffiliates() {
    await Promise.all([this.clearTraffic(), this.clearAffiliates()]);
    // Create Affiliate
    Logger.log('Saving affiliate...', SeedService.name);
    return creator.createInitialAffiliateDataList();
  }
  async seedLeads() {
    await this.clearLeads();
    // Create Lead
    Logger.log('Save lead...', SeedService.name);
    return creator.createInitialLeadDataList();
  }
  async seedTransfers() {
    await this.clearTransfers();
    Logger.log('Save transfers...', SeedService.name);
    return creator.createInitialTransferDataList();
  }
}
