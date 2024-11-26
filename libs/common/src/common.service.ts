import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { isDateString, isEmail, isPhoneNumber } from 'class-validator';
import CountryCodeEnum from '@common/common/enums/country.code.affico.enum';
import { CountryCode } from 'libphonenumber-js';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  ClientProxyFactory,
  RedisOptions,
  RmqContext,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { QuerySearchAnyDto } from './models/query_search-any.dto';

@Injectable()
export class CommonService {
  static getNumberDigits(number: number, digitsExpected = 2) {
    return number.toString().padStart(digitsExpected, '0');
  }
  static async checkSearchText(
    service,
    builder,
    updateEventName: string,
    updateEventFunction: string,
    properties: string[],
    query: QuerySearchAnyDto = {},
    withRta = false,
  ) {
    query.relations = properties;
    query.page = 1;
    let rta;
    do {
      const elems = await service.findAll(query);
      elems.list = elems.list.map((item) => {
        item.searchText = service.getSearchText(item);
        builder[updateEventFunction](updateEventName, {
          id: item._id,
          searchText: item.searchText,
        });
        Logger.debug(
          `${item.numericId} - ${item.leadEmail}`,
          `Updated searchText page ${elems.currentPage} / ${elems.lastPage}`,
        );
        return item;
      });
      query.page = elems.nextPage;
      if (withRta) {
        if (!rta) {
          rta = elems;
        } else {
          rta.list = rta.list.concat(elems.list);
        }
      }
    } while (query.page != 1);
    if (withRta) {
      return rta;
    }
  }

  static camelize(str, joinWords = false) {
    const rta = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    });
    if (joinWords) {
      return rta.replace(/\s+/g, '');
    }
    return rta;
  }

  static async getTimeToFunction<Trta = any>(
    func,
    functionName = '------',
    onlyTimeLapse = false,
  ): Promise<Trta> {
    if (typeof func !== 'function') {
      throw new BadRequestException('Func must be a function');
    }
    const start = new Date();
    try {
      const rta = await func();
      const end = new Date();
      if (!onlyTimeLapse) {
        Logger.log(`${functionName} start: ${start.toISOString()}`);
        Logger.log(
          `${functionName} end: ${end.toISOString()}`,
          'Time to function',
        );
      }
      Logger.log(
        `${functionName} Timed lapsed (ms): ${end.getTime() - start.getTime()}`,
        'Time to function',
      );
      return rta;
    } catch (error) {
      const end = new Date();
      Logger.log(`${functionName} start: ${start.toISOString()}`);
      Logger.log(
        `${functionName} end: ${end.toISOString()}`,
        'Time to function',
      );
      Logger.log(
        `${functionName} Timed lapsed (ms): ${end.getTime() - start.getTime()}`,
        'Time to function',
      );
      throw error;
    }
  }
  static patternPassword =
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  static generatePassword(size = 8): string {
    return Math.random()
      .toString(36)
      .slice(size * -1);
  }

  static validateEmail(email: string) {
    return isEmail(email);
  }

  static randomIntNumber(max: number) {
    return parseInt((Math.random() * max + 1).toString());
  }

  static validatePhoneNumber(phoneNumber: string, region?: CountryCodeEnum) {
    if (!region || !region?.length) {
      return isPhoneNumber(phoneNumber);
    }
    return isPhoneNumber(phoneNumber, region as CountryCode);
  }

  static getHash(password: string, salt = 10) {
    return bcrypt.hashSync(password, salt);
  }

  static getSeparatorSearchText(): string {
    return '_|_';
  }
  static escapeStringRegex(str: string) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  }

  static getDateTime(date: Date, utc = true) {
    return (
      CommonService.getDate(date, utc) + ' ' + CommonService.getTime(date, utc)
    );
  }

  static getDate(date: Date, utc = true) {
    return `${
      utc ? date.getUTCFullYear() : date.getFullYear()
    }/${CommonService.getNumberDigits(
      (utc ? date.getUTCMonth() : date.getMonth()) + 1,
    )}/${CommonService.getNumberDigits(
      utc ? date.getUTCDate() : date.getDate(),
    )}`;
  }

  static getTime(date: Date, utc = true) {
    return `${CommonService.getNumberDigits(
      utc ? date.getUTCHours() : date.getHours(),
    )}:${CommonService.getNumberDigits(
      utc ? date.getUTCMinutes() : date.getMinutes(),
    )}:${CommonService.getNumberDigits(
      utc ? date.getUTCSeconds() : date.getSeconds(),
    )}`;
  }

  static getDateFromOutside(
    dateValue: string,
    start = null,
    utc = false,
  ): Date {
    if (!isDateString(dateValue)) {
      throw new BadRequestException('Bad format date');
    }
    const date = new Date(dateValue);
    if (start !== null) {
      // TODO[hender - 2024/02/22] Adjust to GMT-6
      const offset = new Date().getTimezoneOffset() / 60;
      if (date.getHours() >= 24 - offset) {
        date.setHours(date.getHours() + offset);
      }
      if (start) {
        if (utc) {
          date.setUTCHours(0, 0, 0, 0);
        } else {
          date.setHours(0, 0, 0, 0);
        }
      } else {
        if (utc) {
          date.setUTCHours(23, 59, 59, 999);
        } else {
          date.setHours(23, 59, 59, 999);
        }
      }
    }
    return date;
  }

  static getSlug(str: string) {
    return str
      .toString()
      .normalize('NFD') // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, '-');
  }
  static factoryEventClient(name: string, noAck = false) {
    return (configService: ConfigService) => {
      const host = configService.get<string>('RABBIT_MQ_HOST');
      const opts = {
        username: configService.get<string>('RABBIT_MQ_USERNAME'),
        password: configService.get<string>('RABBIT_MQ_PASSWORD'),
        host: host,
        port: configService.get<string>('RABBIT_MQ_PORT'),
        //queue: configService.get<string>(`RMQ_${name}_QUEUE`),
        queue: configService.get<string>('RABBIT_MQ_QUEUE'),
        //queue: 'DEV',
        protocol: host === 'localhost' ? 'amqp' : 'amqps',
      };
      const clientOptions: RmqOptions = {
        transport: Transport.RMQ,
        options: {
          urls: [
            `${opts.protocol}://${opts.username}:${opts.password}@${opts.host}:${opts.port}/`,
          ],
          noAck,
          queue: opts.queue,
          persistent: true,
          queueOptions: {
            durable: false,
          },
        },
      };
      return ClientProxyFactory.create(clientOptions);
    };
  }

  static addTimeout(
    schedulerRegistry: SchedulerRegistry,
    name: string,
    milliseconds: number,
    callback: any,
  ) {
    if (typeof callback !== 'function') {
      throw new BadRequestException('The callback must be a function');
    }
    const timeout = setTimeout(callback, milliseconds);
    schedulerRegistry.addTimeout(name, timeout);
  }

  static ack(ctx: RmqContext) {
    if (!!ctx) {
      const channel = ctx.getChannelRef();
      const originalMessage = ctx.getMessage();
      channel.ack(originalMessage);
    }
  }
  static cleanString(str: string) {
    return str
      .replace(/[+*\n]|^\d+|\"|\,/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .trim();
  }

  static checkDateAttr(attrVal: any, utc = false) {
    /* Logger.log(process.env.TZ, 'Timezone checkDateAttr');
    const offset = new Date().getTimezoneOffset();
    const timezone =
      (offset >= 0 ? '-' : '+') +
      offset / 60 +
      ':' +
      String(offset % 60).padStart(2, '0');
    Logger.log(timezone, 'Timezone checkDateAttr'); */
    //Logger.log(attrVal, 'Init date checkDateAttr');
    if (attrVal['start'] || attrVal['end']) {
      // Is range
      let greater = attrVal['doNotInclude'] ? '$gt' : '$gte';
      let smaller = attrVal['doNotInclude'] ? '$lt' : '$lte';
      const range = {};
      if (isDateString(attrVal['start'])) {
        if (!isDateString(attrVal['end'])) {
          greater = '$gt';
        }
        range[greater] = CommonService.getDateFromOutside(
          attrVal['start'],
          true,
          utc,
        );
      }
      if (isDateString(attrVal['end'])) {
        if (!isDateString(attrVal['start'])) {
          smaller = '$lt';
        }
        range[smaller] = CommonService.getDateFromOutside(
          attrVal['end'],
          false,
          utc,
        );
      }
      attrVal = {};
      if (range[greater]) {
        attrVal[greater] = range[greater];
      }
      if (range[smaller]) {
        attrVal[smaller] = range[smaller];
      }
    }
    //Logger.log(attrVal, 'End date checkDateAttr');
    return attrVal;
  }
}
