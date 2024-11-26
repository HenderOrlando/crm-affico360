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
import { StatsDatePspAccount } from '@stats/stats/entities/mongoose/stats.date.psp.account.schema';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
import EventsNamesStatsEnum from './enum/events.names.stats.enum';
import { StatsPspAccountServiceService } from './stats-psp-account-service.service';
import { BuildersService } from '@builder/builders';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';
import { FileServiceService } from 'apps/file-service/src/file-service.service';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway(parseInt(EventsNamesStatsEnum.websocketPortStatsPspAccount), {
  namespace: EventsNamesStatsEnum.clientNameStatsPspAccount,
  cors: {
    origin: '*',
  },
})
export class StatsPspAccountServiceWebsocketGateway extends BasicWebsocketGateway<StatsDatePspAccount> {
  @WebSocketServer()
  protected server: Server;

  constructor(
    protected readonly service: StatsPspAccountServiceService,
    protected readonly serviceFile: FileServiceService,
    private readonly builder: BuildersService,
  ) {
    super(service);
  }

  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage(EventsNamesStatsEnum.downloadPspAccount)
  findAll(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<
    WsResponse<ResponseDownloadWebsocketInterface<StatsDatePspAccount>>
  > {
    const strQuery = JSON.stringify(query);
    const filename = this.getFullname(
      EventsNamesStatsEnum.clientNameStatsPspAccount,
      query,
    );
    query.relations = ['affiliate', 'brand', 'pspAccount'];
    this.addDataToFile({}, filename, true, strQuery, true);
    Logger.debug(query, 'QUERY PAYSYS DOWNLOAD');
    return super.findAll(
      query,
      EventsNamesStatsEnum.downloadPspAccount,
      filename,
      (rta: ResponseDownloadWebsocketInterface<StatsDatePspAccount>) => {
        if (rta.item) {
          this.addDataToFile(rta.item, filename, false, strQuery);
        }
      },
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
        PSP_ACCOUNT: item?.pspAccount?.name ?? '',
        COUNTRY: item?.country ?? '',
        LEADS: item?.quantityLeads ?? 0,
        FTDS: item?.quantityFtd ?? 0,
        CFTDS: item?.quantityCftd ?? 0,
        TOTAL_CFTDS: (item?.quantityFtd ?? 0) + (item?.quantityCftd ?? 0),
        PERCENTAGE_CFTD: (item?.quantityCftd ?? 0) / item?.quantityLeads ?? 0,
        PERCENTAGE_AFFILIATE_CONVERSION: item?.conversionDatabase ?? 0,
        PERCENTAGE_REAL_CONVERTION: item?.conversion ?? 0,
      }),
    } as FileUpdateDto);
    /* this.builder.getPromiseFileEventClient<File>(
      EventsNamesFileEnum.addDataToFile,
      {
        isFirst,
        onlyHeaders,
        name: filename,
        description: `Download with:\n ${strQuery}`,
        mimetype: 'text/csv',
        data: JSON.stringify({
          AFFILIATE_ID: item?.affiliate?._id ?? '',
          AFFILIATE: item?.affiliate?.name ?? '',
          BRAND: item?.brand?.name ?? 0,
          PSP_ACCOUNT: item?.pspAccount?.name ?? '',
          COUNTRY: item?.country ?? '',
          LEADS: item?.quantityLeads ?? 0,
          FTDS: item?.quantityFtd ?? 0,
          CFTDS: item?.quantityCftd ?? 0,
          TOTAL_CFTDS: (item?.quantityFtd ?? 0) + (item?.quantityCftd ?? 0),
          PERCENTAGE_CFTD: (item?.quantityCftd ?? 0) / item?.quantityLeads ?? 0,
          PERCENTAGE_AFFILIATE_CONVERSION: item?.conversionDatabase ?? 0,
          PERCENTAGE_REAL_CONVERTION: item?.conversion ?? 0,
        }),
      },
    ); */
  }
}
