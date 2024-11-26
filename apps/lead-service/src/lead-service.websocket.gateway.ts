import { Lead } from '@lead/lead/entities/mongoose/lead.schema';
import { ResponseDownloadWebsocketInterface } from '@common/common/interfaces/response.download.websocket.interface';
import { BasicWebsocketGateway } from '@common/common/models/basic.websocket.gateway';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, Subscriber, map } from 'rxjs';
import { Server } from 'socket.io';
import { LeadServiceService } from './lead-service.service';
import EventsNamesLeadEnum from './enum/events.names.lead.enum';
import { CommonService } from '@common/common';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';
import { BuildersService } from '@builder/builders';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import { Logger } from '@nestjs/common';
import { FileServiceService } from 'apps/file-service/src/file-service.service';

@WebSocketGateway(parseInt(EventsNamesLeadEnum.websocketPort), {
  namespace: EventsNamesLeadEnum.clientName,
  cors: {
    origin: '*',
  },
})
export class LeadServiceWebsocketGateway extends BasicWebsocketGateway<Lead> {
  @WebSocketServer()
  protected server: Server;
  private mapFilter = {};

  constructor(
    protected readonly service: LeadServiceService,
    private readonly builder: BuildersService,
    protected readonly serviceFile: FileServiceService,
  ) {
    super(service);
    this.mapFilter[EventsNamesLeadEnum.download] = 'getAll';
    this.mapFilter[EventsNamesLeadEnum.downloadDatabase] = 'getDatabase';
    this.mapFilter[EventsNamesLeadEnum.downloadData] = 'getAll';
    this.mapFilter[EventsNamesLeadEnum.downloadCftd] = 'getCftd';
    this.mapFilter[EventsNamesLeadEnum.downloadFtd] = 'getTransferFtd';
    this.mapFilter[EventsNamesLeadEnum.downloadRetention] = 'getRetention';
  }

  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage(EventsNamesLeadEnum.download)
  findAll(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Lead>>> {
    return this.getDownload(query, EventsNamesLeadEnum.download);
  }
  @SubscribeMessage(EventsNamesLeadEnum.downloadDatabase)
  findAllDatabase(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Lead>>> {
    return this.getDownload(query, EventsNamesLeadEnum.downloadDatabase);
  }
  @SubscribeMessage(EventsNamesLeadEnum.downloadData)
  findAllData(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Lead>>> {
    return this.getDownload(query, EventsNamesLeadEnum.downloadData);
  }
  @SubscribeMessage(EventsNamesLeadEnum.downloadCftd)
  findAllCftd(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Lead>>> {
    return this.getDownload(query, EventsNamesLeadEnum.downloadCftd);
  }
  @SubscribeMessage(EventsNamesLeadEnum.downloadFtd)
  findAllFtd(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Lead>>> {
    return this.getDownload(query, EventsNamesLeadEnum.downloadFtd);
  }
  @SubscribeMessage(EventsNamesLeadEnum.downloadRetention)
  findAllRetention(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Lead>>> {
    return this.getDownload(query, EventsNamesLeadEnum.downloadRetention);
  }

  private getDownload(
    query: QuerySearchAnyDto,
    downloadEvt: EventsNamesLeadEnum,
  ) {
    const strQuery = JSON.stringify(query);
    const filename = this.getFullname(`${downloadEvt}`, query);
    const file = this.builder.getPromiseFileEventClient<File>(
      EventsNamesFileEnum.createOne,
      {
        name: filename,
        description: `Download with:\n ${strQuery}`,
        mimetype: 'text/csv',
      } as FileUpdateDto,
    );
    query.relations = [
      'brand',
      'affiliate',
      'status',
      'statusCrm',
      'country',
      'referralType',
    ];
    if (query.where.createdAt) {
      // TODO[hender - 2024/03/11] If createdAt param received, assume filter by createdAt, CFTD or FTD date
      query.where.start = query.where.createdAt.start;
      query.where.end = query.where.createdAt.end;
      delete query.where.createdAt;
    }
    Logger.debug(query, 'QUERY LEAD DOWNLOAD');
    this.addDataToFile({}, filename, true, strQuery, downloadEvt, true);
    setTimeout(() => null, 50);
    return new Observable<ResponseDownloadWebsocketInterface<Lead>>(
      (subscriber: Subscriber<ResponseDownloadWebsocketInterface<Lead>>) => {
        this.findList(
          {
            ...query,
            page: 1,
            take: 1,
          },
          subscriber,
          filename,
          this.mapFilter[downloadEvt],
        );
      },
    ).pipe(
      map((item) => {
        //Logger.debug(item);
        file.then(() => {
          this.onRead(strQuery, filename, downloadEvt, item);
        });
        return {
          event: downloadEvt,
          data: item,
        };
      }),
    );
  }

  private onRead(
    strQuery: string,
    filename: string,
    downloadEvt: EventsNamesLeadEnum,
    rta: ResponseDownloadWebsocketInterface<Lead>,
  ) {
    if (rta.item) {
      this.addDataToFile(rta.item, filename, false, strQuery, downloadEvt);
    }
  }

  private addDataToFile(
    item,
    filename,
    isFirst,
    strQuery,
    downloadEvt,
    onlyHeaders = false,
  ) {
    this.serviceFile.addDataToFile({
      isFirst,
      onlyHeaders,
      name: filename,
      description: `Download with:\n ${strQuery}`,
      mimetype: 'text/csv',
      data: JSON.stringify(this.getDownloadDataFromItem(item, downloadEvt)),
    } as FileUpdateDto);
    /* this.builder.emitFileEventClient<File>(EventsNamesFileEnum.addDataToFile, {
      isFirst,
      onlyHeaders,
      name: filename,
      description: `Download with:\n ${strQuery}`,
      mimetype: 'text/csv',
      data: JSON.stringify(this.getDownloadDataFromItem(item, downloadEvt)),
    } as FileUpdateDto); */
  }

  private getDownloadDataFromItem(
    lead: Lead,
    downloadEvt: EventsNamesLeadEnum,
  ) {
    switch (downloadEvt) {
      case EventsNamesLeadEnum.download:
        return this.getDownloadDataFromItemLead(lead);
      case EventsNamesLeadEnum.downloadDatabase:
        return this.getDownloadDataFromItemDatabase(lead);
      case EventsNamesLeadEnum.downloadData:
        return this.getDownloadDataFromItemData(lead);
      case EventsNamesLeadEnum.downloadCftd:
        return this.getDownloadDataFromItemCftd(lead);
      case EventsNamesLeadEnum.downloadRetention:
      case EventsNamesLeadEnum.downloadFtd:
        return this.getDownloadDataFromItemFtd(lead);
    }
  }

  private getDownloadDataFromItemLead(lead: Lead) {
    const rta = {
      email: CommonService.cleanString(lead?.email ?? ''),
      tpId: lead?.crmIdLead ?? '',
      country: CommonService.cleanString(lead?.country ?? ''),
      status: CommonService.cleanString(
        ((lead?.statusCrm && lead?.statusCrm[0]) || lead?.status)?.name ?? '',
      ),
      ftdType: CommonService.cleanString(
        lead?.dateFTD ? 'Ftd' : lead?.dateCFTD ? 'Cftd' : 'N/A',
      ),
      affiliate: CommonService.cleanString(lead?.affiliate?.name ?? ''),
      bu: CommonService.cleanString(lead?.brand?.name ?? ''),
      partialFtdDate: lead?.partialFtdDate
        ? CommonService.getDateTime(new Date(lead?.partialFtdDate), false)
        : '',
      partialFtdAmount: lead?.partialFtdAmount ?? '',
      insertDate: lead?.createdAt
        ? CommonService.getDateTime(new Date(lead?.createdAt), false)
        : '',
      ftdDate: lead?.dateCFTD
        ? CommonService.getDateTime(new Date(lead?.dateCFTD), false)
        : '',
      AffiliateFtdDate: lead?.dateFTD
        ? CommonService.getDateTime(new Date(lead?.dateFTD), false)
        : '',
      referral: CommonService.cleanString(lead?.referral ?? ''),
      source: CommonService.cleanString(lead?.sourceId ?? ''),
      campaign: CommonService.cleanString(lead?.campaign ?? ''),
      lastNote: CommonService.cleanString(''),
    };
    return rta;
  }
  private getDownloadDataFromItemDatabase(lead: Lead) {
    return {
      email: CommonService.cleanString(lead?.email ?? ''),
      tpId: lead?.crmIdLead ?? '',
      country: CommonService.cleanString(lead?.country ?? ''),
      status:
        ((lead?.statusCrm && lead?.statusCrm[0]) ?? lead?.status)?.name ?? '',
      ftdType: CommonService.cleanString(
        lead?.dateFTD ? 'Ftd' : lead?.dateCFTD ? 'Cftd' : 'N/A',
      ),
      affiliate: CommonService.cleanString(lead?.affiliate?.name ?? ''),
      bu: CommonService.cleanString(lead?.brand?.name ?? ''),
      insertDate: lead?.createdAt
        ? CommonService.getDateTime(new Date(lead?.createdAt), false)
        : '',
      ftdDate: lead?.dateCFTD
        ? CommonService.getDateTime(new Date(lead?.dateCFTD), false)
        : '',
      AffiliateFtdDate: lead?.dateFTD
        ? CommonService.getDateTime(new Date(lead?.dateFTD), false)
        : '',
      referral: CommonService.cleanString(lead?.referral ?? ''),
      source: CommonService.cleanString(lead?.sourceId ?? ''),
      campaign: CommonService.cleanString(lead?.campaign ?? ''),
      lastNote: CommonService.cleanString(''),
    };
  }
  private getDownloadDataFromItemData(lead: Lead) {
    return {
      email: CommonService.cleanString(lead?.email ?? ''),
      tpId: lead?.crmIdLead ?? '',
      country: CommonService.cleanString(lead?.country ?? ''),
      status:
        ((lead?.statusCrm && lead?.statusCrm[0]) ?? lead?.status)?.name ?? '',
      ftdType: CommonService.cleanString(
        lead?.dateFTD ? 'Ftd' : lead?.dateCFTD ? 'Cftd' : 'N/A',
      ),
      affiliate: CommonService.cleanString(lead?.affiliate?.name ?? ''),
      bu: CommonService.cleanString(lead?.brand?.name ?? ''),
      quantityDeposit: lead?.quantityTransfer ?? '',
      totalDeposit: lead?.totalPayed ?? '',
      partialFtdDate: lead?.partialFtdDate
        ? CommonService.getDateTime(new Date(lead?.partialFtdDate), false)
        : '',
      partialFtdAmount: lead?.partialFtdAmount ?? '',
      insertDate: lead?.createdAt
        ? CommonService.getDateTime(new Date(lead?.createdAt), false)
        : '',
      ftdDate: lead?.dateCFTD
        ? CommonService.getDateTime(new Date(lead?.dateCFTD), false)
        : '',
      AffiliateFtdDate: lead?.dateFTD
        ? CommonService.getDateTime(new Date(lead?.dateFTD), false)
        : '',
      referral: CommonService.cleanString(lead?.referral ?? ''),
      source: CommonService.cleanString(lead?.sourceId ?? ''),
      campaign: CommonService.cleanString(lead?.campaign ?? ''),
      lastNote: CommonService.cleanString(''),
    };
  }
  private getDownloadDataFromItemCftd(lead: Lead) {
    return {
      email: CommonService.cleanString(lead?.email ?? ''),
      tpId: lead?.crmIdLead ?? '',
      country: CommonService.cleanString(lead?.country ?? ''),
      status:
        ((lead?.statusCrm && lead?.statusCrm[0]) ?? lead?.status)?.name ?? '',
      ftdType: CommonService.cleanString(
        lead?.dateFTD ? 'Ftd' : lead?.dateCFTD ? 'Cftd' : 'N/A',
      ),
      affiliate: CommonService.cleanString(lead?.affiliate?.name ?? ''),
      bu: CommonService.cleanString(lead?.brand?.name ?? ''),
      insertDate: lead?.createdAt
        ? CommonService.getDateTime(new Date(lead?.createdAt), false)
        : '',
      ftdDate: lead?.dateCFTD
        ? CommonService.getDateTime(new Date(lead?.dateCFTD), false)
        : '',
      AffiliateFtdDate: lead?.dateFTD
        ? CommonService.getDateTime(new Date(lead?.dateFTD), false)
        : '',
      retentionDate: lead?.dateRetention
        ? CommonService.getDateTime(new Date(lead?.dateRetention), false)
        : '',
      referral: CommonService.cleanString(lead?.referral ?? ''),
      source: CommonService.cleanString(lead?.sourceId ?? ''),
      campaign: CommonService.cleanString(lead?.campaign ?? ''),
      lastNote: CommonService.cleanString(''),
    };
  }
  private getDownloadDataFromItemFtd(lead: Lead) {
    return {
      email: CommonService.cleanString(lead?.email ?? ''),
      tpId: lead?.crmIdLead ?? '',
      country: CommonService.cleanString(lead?.country ?? ''),
      status:
        ((lead?.statusCrm && lead?.statusCrm[0]) ?? lead?.status)?.name ?? '',
      ftdType: CommonService.cleanString(
        lead?.dateFTD ? 'Ftd' : lead?.dateCFTD ? 'Cftd' : 'N/A',
      ),
      affiliate: CommonService.cleanString(lead?.affiliate?.name ?? ''),
      bu: CommonService.cleanString(lead?.brand?.name ?? ''),
      insertDate: lead?.createdAt
        ? CommonService.getDateTime(new Date(lead?.createdAt), false)
        : '',
      ftdDate: lead?.dateCFTD
        ? CommonService.getDateTime(new Date(lead?.dateCFTD), false)
        : '',
      AffiliateFtdDate: lead?.dateFTD
        ? CommonService.getDateTime(new Date(lead?.dateFTD), false)
        : '',
      retentionDate: lead?.dateRetention
        ? CommonService.getDateTime(new Date(lead?.dateRetention), false)
        : '',
      referral: CommonService.cleanString(lead?.referral ?? ''),
      source: CommonService.cleanString(lead?.sourceId ?? ''),
      campaign: CommonService.cleanString(lead?.campaign ?? ''),
      lastNote: CommonService.cleanString(''),
    };
  }
}
