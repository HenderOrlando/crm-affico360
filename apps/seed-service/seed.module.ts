import { BusinessUnitModule } from '@business-unit/business-unit';
import { PermissionModule } from '@permission/permission';
import { AffiliateModule } from '@affiliate/affiliate';
import { LeadModule } from '@lead/lead/lead.module';
import { CategoryModule } from '@category/category';
import { BuildersModule } from '@builder/builders';
import { SeedController } from './seed.controller';
import { StatusModule } from '@status/status';
import { SeedService } from './seed.service';
import { StatsModule } from '@stats/stats';
import { Module } from '@nestjs/common';
import { RoleModule } from '@role/role';
import { UserModule } from '@user/user';
import { CrmModule } from '@crm/crm';
import { PspModule } from '@psp/psp';
import { PersonModule } from '@person/person';
import { TrafficModule } from '@traffic/traffic';
import { PspAccountModule } from '@psp-account/psp-account';
import { TransferModule } from '@transfer/transfer';
import { ActivityModule } from '@activity/activity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    CrmModule,
    PspModule,
    UserModule,
    RoleModule,
    LeadModule,
    StatsModule,
    PersonModule,
    StatusModule,
    TrafficModule,
    ActivityModule,
    CategoryModule,
    TransferModule,
    BuildersModule,
    AffiliateModule,
    PspAccountModule,
    PermissionModule,
    BusinessUnitModule,
  ],
  exports: [SeedService],
})
export class SeedModule {}
