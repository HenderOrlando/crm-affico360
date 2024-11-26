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
import { Transfer } from '@transfer/transfer/entities/mongoose/transfer.schema';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
import EventsNamesTransferEnum from './enum/events.names.transfer.enum';
import { TransferServiceService } from './transfer-service.service';
import { CommonService } from '@common/common';
import { BuildersService } from '@builder/builders';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';
import { dataTableHeadersTransfer } from './enum/data.table.headers.transfer';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import { FileServiceService } from 'apps/file-service/src/file-service.service';

@WebSocketGateway(parseInt(EventsNamesTransferEnum.websocketPort), {
  namespace: EventsNamesTransferEnum.clientName,
  cors: {
    origin: '*',
  },
})
export class TransferServiceWebsocketGateway extends BasicWebsocketGateway<Transfer> {
  @WebSocketServer()
  protected server: Server;

  constructor(
    protected readonly service: TransferServiceService,
    private readonly builder: BuildersService,
    protected readonly serviceFile: FileServiceService,
  ) {
    super(service);
  }

  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage(EventsNamesTransferEnum.download)
  findAll(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Transfer>>> {
    const strQuery = JSON.stringify(query);
    const filename = this.getFullname(
      EventsNamesTransferEnum.clientName,
      query,
    );
    query.relations = ['department', 'status', 'pspAccount', 'businessUnit'];
    this.addDataToFile({}, filename, true, strQuery, true);
    return super.findAll(
      query,
      EventsNamesTransferEnum.download,
      filename,
      (rta: ResponseDownloadWebsocketInterface<Transfer>) => {
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
      data: JSON.stringify(this.getDataFromItem(item)),
    } as FileUpdateDto);
    /* this.builder.emitFileEventClient<File>(EventsNamesFileEnum.addDataToFile, {
      isFirst,
      onlyHeaders,
      name: filename,
      description: `Download with:\n ${strQuery}`,
      mimetype: 'text/csv',
      data: JSON.stringify(this.getDataFromItem(item)),
    }); */
  }

  private getDataFromItem(item: Transfer) {
    return {
      ID: item[dataTableHeadersTransfer.ID.key] ?? '',
      NUMERIC_ID: item[dataTableHeadersTransfer.NUMERIC_ID.key] ?? '',
      EMAIL: item[dataTableHeadersTransfer.EMAIL.key] ?? '',
      TP_ID: item[dataTableHeadersTransfer.TP_ID.key] ?? '',
      CRM_ID: item.crm ?? '',
      COUNTRY: item.leadCountry ?? '',
      AMOUNT: item.amount ?? '',
      STATUS_PSP: item.status?.name ?? '',
      DEPARTMENT: item.department?.name ?? '',
      REFERENCE: item.idPayment ?? '',
      PSP_NAME: item.pspAccount?.name ?? '',
      TRANSFER_TYPE: item.operationType ?? '',
      BRAND: item.businessUnit?.name ?? '',
      PSP_ID: item.pspAccount?._id ?? '',
      INSERT_DATE: item.createdAt
        ? CommonService.getDate(new Date(item.createdAt), false)
        : '',
      CONFIRM_DATE: item.confirmedAt
        ? CommonService.getDate(new Date(item.confirmedAt), false)
        : '',
      APPROVE_DATE: item.confirmedAt
        ? CommonService.getDate(new Date(item.approvedAt), false)
        : '',
      STATUS_TRANSACTION: item.hasApproved ? 'Approved' : 'Pending',
    };
  }
}
