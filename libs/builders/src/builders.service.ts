import EventClientEnum from '@common/common/enums/EventsNameEnum';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import EventsNamesActivityEnum from 'apps/activity-service/src/enum/events.names.activity.enum';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
import EventsNamesBusinessUnitEnum from 'apps/business-unit-service/src/enum/events.names.business.unit.enum';
import EventsNamesCategoryEnum from 'apps/category-service/src/enum/events.names.category.enum';
import EventsNamesCrmEnum from 'apps/crm-service/src/enum/events.names.crm.enum';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';
import EventsNamesGroupEnum from 'apps/group-service/src/enum/events.names.group.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import EventsNamesMessageEnum from 'apps/message-service/src/enum/events.names.message.enum';
import EventsNamesPermissionEnum from 'apps/permission-service/src/enum/events.names.permission.enum';
import EventsNamesPersonEnum from 'apps/person-service/src/enum/events.names.person.enum';
import EventsNamesPspAccountEnum from 'apps/psp-service/src/enum/events.names.psp.acount.enum';
import EventsNamesPspEnum from 'apps/psp-service/src/enum/events.names.psp.enum';
import EventsNamesRoleEnum from 'apps/role-service/src/enum/events.names.role.enum';
import EventsNamesStatsEnum from 'apps/stats-service/src/enum/events.names.stats.enum';
import EventsNamesStatusEnum from 'apps/status-service/src/enum/events.names.status.enum';
import EventsNamesTrafficEnum from 'apps/traffic-service/src/enum/events.names.traffic.enum';
import EventsNamesTransferEnum from 'apps/transfer-service/src/enum/events.names.transfer.enum';
import EventsNamesUserEnum from 'apps/user-service/src/enum/events.names.user.enum';
import { Observable, lastValueFrom, startWith } from 'rxjs';

@Injectable()
export class BuildersService {
  constructor(
    @Inject(EventClientEnum.SERVICE_NAME)
    private eventClient: ClientProxy,
    @Inject(EventClientEnum.ACTIVITY)
    private activityClient: ClientProxy,
    @Inject(EventClientEnum.BUSINESS_UNIT)
    private businessUnitClient: ClientProxy,
    @Inject(EventClientEnum.CRM)
    private crmClient: ClientProxy,
    @Inject(EventClientEnum.FILE)
    private fileClient: ClientProxy,
    @Inject(EventClientEnum.MESSAGE)
    private messageClient: ClientProxy,
    @Inject(EventClientEnum.PERMISSION)
    private permissionClient: ClientProxy,
    @Inject(EventClientEnum.PSP)
    private pspClient: ClientProxy,
    @Inject(EventClientEnum.PSP_ACCOUNT)
    private pspAccountClient: ClientProxy,
    @Inject(EventClientEnum.TRAFFIC)
    private trafficClient: ClientProxy,
    @Inject(EventClientEnum.AFFILIATE)
    private affiliateClient: ClientProxy,
    @Inject(EventClientEnum.LEAD)
    private leadClient: ClientProxy,
    @Inject(EventClientEnum.CATEGORY)
    private categoryClient: ClientProxy,
    @Inject(EventClientEnum.TRANSFER)
    private transferClient: ClientProxy,
    @Inject(EventClientEnum.USER)
    private userClient: ClientProxy,
    @Inject(EventClientEnum.STATS)
    private statsClient: ClientProxy,
    @Inject(EventClientEnum.ROLE)
    private roleClient: ClientProxy,
    @Inject(EventClientEnum.STATUS)
    private statusClient: ClientProxy,
    @Inject(EventClientEnum.PERSON)
    private personClient: ClientProxy,
    @Inject(EventClientEnum.GROUP)
    private groupClient: ClientProxy,
  ) {}

  getEventClient(): ClientProxy {
    return this.eventClient;
  }

  getPermissionEventClient(): ClientProxy {
    return this.permissionClient;
  }

  getPspEventClient(): ClientProxy {
    return this.pspClient;
  }

  getCategoryEventClient(): ClientProxy {
    return this.categoryClient;
  }

  getCrmEventClient(): ClientProxy {
    return this.crmClient;
  }

  getFileEventClient(): ClientProxy {
    return this.fileClient;
  }

  getMessageEventClient(): ClientProxy {
    return this.messageClient;
  }

  getPspAccountEventClient(): ClientProxy {
    return this.pspAccountClient;
  }

  getTrafficEventClient(): ClientProxy {
    return this.trafficClient;
  }

  getTransferEventClient(): ClientProxy {
    return this.transferClient;
  }

  getAffiliateEventClient(): ClientProxy {
    return this.affiliateClient;
  }

  getBusinessUnitEventClient(): ClientProxy {
    return this.businessUnitClient;
  }

  getLeadEventClient(): ClientProxy {
    return this.leadClient;
  }

  getStatsEventClient(): ClientProxy {
    return this.statsClient;
  }

  getActivityEventClient(): ClientProxy {
    return this.activityClient;
  }

  getStatusEventClient(): ClientProxy {
    return this.statusClient;
  }

  getPersonEventClient(): ClientProxy {
    return this.personClient;
  }

  getRoleEventClient(): ClientProxy {
    return this.roleClient;
  }

  getUserEventClient(): ClientProxy {
    return this.userClient;
  }

  getGroupEventClient(): ClientProxy {
    return this.groupClient;
  }

  // SEND EVENTS - RETURN PROMISE
  async getPromiseGroupEventClient<TResponse = any>(
    eventName: EventsNamesGroupEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getGroupEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseActivityEventClient<TResponse = any>(
    eventName: EventsNamesActivityEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getActivityEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseAffiliateEventClient<TResponse = any>(
    eventName: EventsNamesAffiliateEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getAffiliateEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseBusinessUnitEventClient<TResponse = any>(
    eventName: EventsNamesBusinessUnitEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getBusinessUnitEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseLeadEventClient<TResponse = any>(
    eventName: EventsNamesLeadEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getLeadEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseCategoryEventClient<TResponse = any>(
    eventName: EventsNamesCategoryEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getCategoryEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseCrmEventClient<TResponse = any>(
    eventName: EventsNamesCrmEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getCrmEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseFileEventClient<TResponse = any>(
    eventName: EventsNamesFileEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getFileEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseStatsEventClient<TResponse = any>(
    eventName: EventsNamesStatsEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getStatsEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseStatusEventClient<TResponse = any>(
    eventName: EventsNamesStatusEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getStatusEventClient(),
      eventName,
      data,
    );
  }
  async getPromisePersonEventClient<TResponse = any>(
    eventName: EventsNamesPersonEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getPersonEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseTransferEventClient<TResponse = any>(
    eventName: EventsNamesTransferEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getTrafficEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseTrafficEventClient<TResponse = any>(
    eventName: EventsNamesTrafficEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getTrafficEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseUserEventClient<TResponse = any>(
    eventName: EventsNamesUserEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getUserEventClient(),
      eventName,
      data,
    );
  }
  async getPromisePspAccountEventClient<TResponse = any>(
    eventName: EventsNamesPspAccountEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getPspAccountEventClient(),
      eventName,
      data,
    ).catch((err) => Logger.error(err, `Event ${eventName}`));
  }
  async getPromisePspEventClient<TResponse = any>(
    eventName: EventsNamesPspEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getPspEventClient(),
      eventName,
      data,
    );
  }
  async getPromisePermissionEventClient<TResponse = any>(
    eventName: EventsNamesPermissionEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getPermissionEventClient(),
      eventName,
      data,
    );
  }
  async getPromiseRoleEventClient<TResponse = any>(
    eventName: EventsNamesRoleEnum,
    data: any,
  ): Promise<TResponse> {
    return this.getPromiseFromObserver(
      this.getRoleEventClient(),
      eventName,
      data,
    );
  }
  // EMIT EVENTS
  emitTransferEventClient<TResponse = any>(
    eventName: EventsNamesTransferEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getTransferEventClient(),
      eventName,
      data,
    );
  }
  emitPspEventClient<TResponse = any>(
    eventName: EventsNamesPspEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getPspAccountEventClient(),
      eventName,
      data,
    );
  }
  emitPermissionEventClient<TResponse = any>(
    eventName: EventsNamesPermissionEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getPermissionEventClient(),
      eventName,
      data,
    );
  }
  emitRoleEventClient<TResponse = any>(
    eventName: EventsNamesRoleEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(this.getRoleEventClient(), eventName, data);
  }
  emitPspAccountEventClient<TResponse = any>(
    eventName: EventsNamesPspEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getPspAccountEventClient(),
      eventName,
      data,
    );
  }

  emitCrmEventClient<TResponse = any>(
    eventName: EventsNamesCrmEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(this.getCrmEventClient(), eventName, data);
  }

  emitFileEventClient<TResponse = any>(
    eventName: EventsNamesFileEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(this.getFileEventClient(), eventName, data);
  }

  emitActivityEventClient<TResponse = any>(
    eventName: EventsNamesActivityEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getActivityEventClient(),
      eventName,
      data,
    );
  }

  emitAffiliateEventClient<TResponse = any>(
    eventName: EventsNamesAffiliateEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getAffiliateEventClient(),
      eventName,
      data,
    );
  }

  emitBusinessUnitEventClient<TResponse = any>(
    eventName: EventsNamesBusinessUnitEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getBusinessUnitEventClient(),
      eventName,
      data,
    );
  }

  emitMessageEventClient<TResponse = any>(
    eventName: EventsNamesMessageEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getMessageEventClient(),
      eventName,
      data,
    );
  }

  emitLeadEventClient<TResponse = any>(
    eventName: EventsNamesLeadEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(this.getLeadEventClient(), eventName, data);
  }

  emitEventClient<TResponse = any>(
    eventClient: ClientProxy,
    eventName: string,
    data: any,
  ): void {
    this.getEventFromObserver<TResponse>(eventClient, eventName, data);
  }

  emitStatsEventClient<TResponse = any>(
    eventName: EventsNamesStatsEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getStatsEventClient(),
      eventName,
      data,
    );
  }

  emitStatusEventClient<TResponse = any>(
    eventName: EventsNamesStatusEnum,
    data: any,
  ): void {
    this.emitEventClient<TResponse>(
      this.getStatusEventClient(),
      eventName,
      data,
    );
  }

  async getPromiseFromObserver<TResponse = any>(
    obs: ClientProxy,
    eventName,
    data,
  ): Promise<TResponse> {
    return await lastValueFrom<TResponse>(
      obs.send(eventName, data).pipe(startWith({})),
    );
  }

  getEventFromObserver<TResponse>(
    obs: ClientProxy,
    eventName,
    data,
  ): Observable<TResponse> {
    return obs.emit<TResponse>(eventName, data);
  }
}
