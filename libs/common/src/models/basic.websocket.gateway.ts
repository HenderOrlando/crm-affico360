import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { BadRequestException } from '@nestjs/common';
import { MessageBody, WsResponse } from '@nestjs/websockets';
import * as fs from 'fs';
import { Observable, Subscriber, map } from 'rxjs';
import { Server } from 'socket.io';
import { CommonService } from '../common.service';
import { ResponseDownloadWebsocketInterface } from '../interfaces/response.download.websocket.interface';
import { BasicMicroserviceService } from './basic.microservices.service';
import * as XLSX from 'xlsx';

export class BasicWebsocketGateway<Schema> {
  protected server: Server;

  constructor(protected readonly service: BasicMicroserviceService) {}

  findAll(
    @MessageBody() query: QuerySearchAnyDto,
    eventName: string,
    filename: string,
    onRead?: any,
    functionName = 'findAll',
  ): Observable<WsResponse<ResponseDownloadWebsocketInterface<Schema>>> {
    return new Observable<ResponseDownloadWebsocketInterface<Schema>>(
      (subscriber: Subscriber<ResponseDownloadWebsocketInterface<Schema>>) => {
        this.findList(
          {
            ...query,
            page: 1,
            take: 1,
          },
          subscriber,
          filename,
          functionName,
        );
      },
    ).pipe(
      map((item) => {
        //Logger.debug(item);
        if (typeof onRead === 'function') {
          onRead(item);
        }
        return {
          event: eventName,
          data: item,
        };
      }),
    );
  }

  protected findList(
    query: QuerySearchAnyDto,
    subscriber: Subscriber<ResponseDownloadWebsocketInterface<Schema>>,
    filename: string,
    functionName = 'findAll',
  ) {
    if (subscriber.closed) {
      return this.complete(subscriber, filename);
    }
    (async (service) => {
      if (!service[functionName]) {
        throw new BadRequestException('Not found the function name');
      }
      const responsePaginator = await service[functionName](query, null);
      if (responsePaginator.currentPage == 1) {
        subscriber.next({
          totalElements: responsePaginator.totalElements,
        } as any);
      }
      const hasContent = responsePaginator.totalElements > 0;
      const isLastPage =
        responsePaginator.currentPage === responsePaginator.lastPage;
      if (hasContent) {
        subscriber.next({
          progress: query.page / responsePaginator.totalElements,
          count: query.page,
          item: responsePaginator.list[0],
        });
      } else {
        subscriber.next({
          progress: 1,
          count: 0,
          item: null,
        });
      }
      if (isLastPage || !hasContent) {
        return setTimeout(async () => {
          await this.sendFile(query, filename, subscriber);
          this.complete(subscriber, filename);
        }, 1000);
      }
      this.findList(
        {
          ...query,
          page: query.page + 1,
        },
        subscriber,
        filename,
      );
    })(this.service);
  }

  protected sendFile(
    query,
    filename,
    subscriber: Subscriber<ResponseDownloadWebsocketInterface<Schema>>,
  ) {
    // TODO[hender] Send csvFile
    return new Promise((res) => {
      if (fs.existsSync(`storage/${filename}`)) {
        const url = `storage/${filename}`;
        const csv = fs.readFileSync(url, {
          encoding: 'base64',
        });
        const book = XLSX.read(csv, { type: 'base64', dense: true });
        XLSX.writeFile(book, url.replace('.csv', '.xlsx'));
        subscriber.next({
          progress: 1,
          count: query.page,
          item: null,
          filename: filename,
          filenameXlsx: filename.replace('.csv', '.xlsx'),
          fileBase64: csv,
          fileBase64Xlsx: fs.readFileSync(url.replace('.csv', '.xlsx'), {
            encoding: 'base64',
          }),
        });
        res(true);
      } else {
        setTimeout(() => this.sendFile(query, filename, subscriber), 1000);
      }
    });
  }

  protected complete(
    subscriber: Subscriber<ResponseDownloadWebsocketInterface<Schema>>,
    filename: string,
  ) {
    setTimeout(() => {
      //Logger.debug(`storage/${filename}`, 'Delete on Complete');
      const fileUri = `storage/${filename}`;
      if (fs.existsSync(fileUri)) {
        fs.unlinkSync(fileUri);
      }
      if (fs.existsSync(fileUri.replace('.csv', '.xlsx'))) {
        fs.unlinkSync(fileUri.replace('.csv', '.xlsx'));
      }
    }, 1000);
    subscriber.unsubscribe();
    subscriber.complete();
  }

  protected getFullname(baseName: string, query: any) {
    const strQuery = JSON.stringify(query);
    const today = new Date();
    const dateStr = CommonService.getSlug(
      `${today.getUTCFullYear()}-${CommonService.getNumberDigits(
        today.getUTCMonth(),
      )}-${today.getUTCDate()}`,
    );
    return `${baseName.toLowerCase()}_${CommonService.getSlug(
      strQuery,
    )}_${dateStr}.csv`;
  }
}
