import { FileUpdateDto } from '@file/file/dto/file.update.dto';
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
import { StatsDateAffiliate } from '@stats/stats/entities/mongoose/stats.date.affiliate.schema';
import { Observable, Subscriber } from 'rxjs';
import { Server } from 'socket.io';
import EventsNamesStatsEnum from './enum/events.names.stats.enum';
import { StatsAffiliateServiceService } from './stats-affiliate-service.service';
import { BuildersService } from '@builder/builders';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';
import { BadRequestException } from '@nestjs/common';
import { FileServiceService } from 'apps/file-service/src/file-service.service';

@WebSocketGateway(parseInt(EventsNamesStatsEnum.websocketPortStatsAffiliate), {
  namespace: EventsNamesStatsEnum.clientNameStatsAffiliate,
  cors: {
    origin: '*',
  },
})
export class StatsAffiliateServiceWebsocketGateway extends BasicWebsocketGateway<StatsDateAffiliate> {
  @WebSocketServer()
  protected server: Server;

  constructor(
    protected readonly service: StatsAffiliateServiceService,
    protected readonly serviceFile: FileServiceService,
    private readonly builder: BuildersService,
  ) {
    super(service);
  }

  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage(EventsNamesStatsEnum.downloadAffiliate)
  findAll(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<
    WsResponse<ResponseDownloadWebsocketInterface<StatsDateAffiliate>>
  > {
    const strQuery = JSON.stringify(query);
    const filename = this.getFullname(
      EventsNamesStatsEnum.clientNameStatsAffiliate,
      query,
    );
    query = query || {};
    query.where = query.where || {};
    query.relations = ['affiliate', 'brand'];
    if (query.where.dateCheck) {
      query.where.$or = [];
      query.where.$or.push({
        dateCheck: query.where.dateCheck,
      });
      query.where.$or.push({
        dateCheckCFTD: query.where.dateCheck,
      });
      query.where.$or.push({
        dateCheckFTD: query.where.dateCheck,
      });
      delete query.where.dateCheck;
    }
    this.addDataToFile({}, filename, true, strQuery, true);
    return super.findAll(
      query,
      EventsNamesStatsEnum.downloadAffiliate,
      filename,
      (rta: ResponseDownloadWebsocketInterface<StatsDateAffiliate>) => {
        if (rta.item) {
          this.addDataToFile(rta.item, filename, false, strQuery);
        }
      },
      'getStatsDateAffiliates',
    );
  }

  private addDataToFile(
    item,
    filename,
    isFirst,
    strQuery,
    onlyHeaders = false,
  ) {
    this.serviceFile.addDataToFile({
      isFirst,
      onlyHeaders,
      name: filename,
      description: `Download with:\n ${strQuery}`,
      mimetype: 'text/csv',
      data: JSON.stringify({
        AFFILIATE_ID: item?.affiliate?._id ?? '',
        AFFILIATE: item?.affiliate?.name ?? '',
        BRAND: item?.brand?.name ?? 0,
        //COUNTRY: rta.item?.country ?? '',
        LEADS: item?.quantityLeads ?? 0,
        FTDS: item?.quantityFtd ?? 0,
        CFTDS: item?.quantityCftd ?? 0,
        TOTAL_CFTDS: (item?.quantityFtd ?? 0) + (item?.quantityCftd ?? 0),
        PERCENTAGE_CFTD: (item?.quantityCftd ?? 0) / item?.quantityLeads ?? 0,
        PERCENTAGE_AFFILIATE_CONVERSION: item?.conversionApprovedLead ?? 0,
        PERCENTAGE_REAL_CONVERTION: item?.conversion ?? 0,
      }),
    } as FileUpdateDto);
    /* this.builder.emitFileEventClient<File>(EventsNamesFileEnum.addDataToFile, {
      isFirst,
      onlyHeaders,
      name: filename,
      description: `Download with:\n ${strQuery}`,
      mimetype: 'text/csv',
      data: JSON.stringify({
        AFFILIATE_ID: item?.affiliate?._id ?? '',
        AFFILIATE: item?.affiliate?.name ?? '',
        BRAND: item?.brand?.name ?? 0,
        //COUNTRY: rta.item?.country ?? '',
        LEADS: item?.quantityLeads ?? 0,
        FTDS: item?.quantityFtd ?? 0,
        CFTDS: item?.quantityCftd ?? 0,
        TOTAL_CFTDS: (item?.quantityFtd ?? 0) + (item?.quantityCftd ?? 0),
        PERCENTAGE_CFTD: (item?.quantityCftd ?? 0) / item?.quantityLeads ?? 0,
        PERCENTAGE_AFFILIATE_CONVERSION: item?.conversionApprovedLead ?? 0,
        PERCENTAGE_REAL_CONVERTION: item?.conversion ?? 0,
      }),
    }); */
  }
  findList(
    query: QuerySearchAnyDto,
    subscriber: Subscriber<
      ResponseDownloadWebsocketInterface<StatsDateAffiliate>
    >,
    filename: string,
    functionName = 'getStatsDateAffiliates',
  ) {
    if (subscriber.closed) {
      return this.complete(subscriber, filename);
    }
    (async (service) => {
      if (!service[functionName]) {
        throw new BadRequestException('Not found the function name');
      }
      const responsePaginator = await service[functionName](query, null);
      subscriber.next({
        totalElements: responsePaginator.length,
      } as any);
      const hasContent = responsePaginator && responsePaginator.length > 0;
      if (hasContent) {
        let idx = 0;
        for (const item of responsePaginator) {
          if (idx + 1 !== 1) {
            setTimeout(() => null, 1000);
          }
          subscriber.next({
            progress: (idx + 1) / responsePaginator.length,
            count: idx + 1,
            item: item,
          });
          idx++;
        }
      } else {
        subscriber.next({
          progress: 1,
          count: 0,
          item: null,
        });
      }
      return setTimeout(async () => {
        await this.sendFile(query, filename, subscriber);
        this.complete(subscriber, filename);
      }, 1000);
    })(this.service);
  }
}
