import { Activity } from '@activity/activity/entities/mongoose/activity.schema';
import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import { ResponseDownloadWebsocketInterface } from '@common/common/interfaces/response.download.websocket.interface';
import { BasicWebsocketGateway } from '@common/common/models/basic.websocket.gateway';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { FileUpdateDto } from '@file/file/dto/file.update.dto';
import { File } from '@file/file/entities/mongoose/file.schema';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import EventsNamesFileEnum from 'apps/file-service/src/enum/events.names.file.enum';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
import { ActivityServiceService } from './activity-service.service';
import EventsNamesActivityEnum from './enum/events.names.activity.enum';

@WebSocketGateway(parseInt(EventsNamesActivityEnum.websocketPort), {
  namespace: EventsNamesActivityEnum.clientName,
  cors: {
    origin: '*',
  },
})
export class ActivityServiceWebsocketGateway extends BasicWebsocketGateway<Activity> {
  @WebSocketServer()
  protected server: Server;

  constructor(
    protected readonly service: ActivityServiceService,
    private readonly builder: BuildersService,
  ) {
    super(service);
  }

  //@UseGuards(JwtAuthGuard)
  @SubscribeMessage(EventsNamesActivityEnum.download)
  findAll(
    @MessageBody() query: QuerySearchAnyDto,
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Activity>>> {
    const strQuery = JSON.stringify(query);
    const filename = this.getFullname(
      EventsNamesActivityEnum.clientName,
      query,
    );
    query.relations = ['creator'];
    this.addDataToFile({}, filename, true, strQuery, true);
    return super.findAll(
      query,
      EventsNamesActivityEnum.download,
      filename,
      (rta: ResponseDownloadWebsocketInterface<Activity>) => {
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
    this.builder.emitFileEventClient<File>(EventsNamesFileEnum.addDataToFile, {
      isFirst,
      onlyHeaders,
      name: filename,
      description: `Download with:\n ${strQuery}`,
      mimetype: 'text/csv',
      data: JSON.stringify({
        name: item?.name ?? '',
        user: item?.creator?.name ?? '',
        description: item?.description ?? '',
        action: item?.action ?? '',
        resource: item?.resource ?? '',
        dateAction: item?.createdAt
          ? CommonService.getDate(new Date(item?.createdAt), false)
          : '',
        timeAction: item?.createdAt
          ? CommonService.getTime(new Date(item?.createdAt), false)
          : '',
        //data: JSON.stringify(rta.item.object ?? {}),
      }),
    } as FileUpdateDto);
  }
}
