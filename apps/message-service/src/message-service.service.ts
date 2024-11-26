import { BuildersService } from '@builder/builders';
import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { CrmInterface } from '@crm/crm/entities/crm.interface';
import { Crm } from '@crm/crm/entities/mongoose/crm.schema';
import { LeadDocument } from '@lead/lead/entities/mongoose/lead.schema';
import { MessageServiceMongooseService } from '@message/message';
import { MessageCreateDto } from '@message/message/dto/message.create.dto';
import { MessageUpdateDto } from '@message/message/dto/message.update.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import EventsNamesCrmEnum from 'apps/crm-service/src/enum/events.names.crm.enum';
import EventsNamesLeadEnum from 'apps/lead-service/src/enum/events.names.lead.enum';
import axios from 'axios';

@Injectable()
export class MessageServiceService {
  private apiKey: string;
  private url: string;
  constructor(
    @Inject(ConfigService)
    readonly configService: ConfigService,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
    @Inject(MessageServiceMongooseService)
    private lib: MessageServiceMongooseService,
  ) {
    this.apiKey = configService.getOrThrow('API_KEY_EMAIL_APP');
    this.url = configService.getOrThrow('URL_API_EMAIL_APP');
  }

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newMessage(message: MessageCreateDto) {
    return this.lib.create(message);
  }

  async newManyMessage(createMessagesDto: MessageCreateDto[]) {
    return this.lib.createMany(createMessagesDto);
  }

  async updateMessage(message: MessageUpdateDto) {
    return this.lib.update(message.id.toString(), message);
  }

  async updateManyMessages(messages: MessageUpdateDto[]) {
    return this.lib.updateMany(
      messages.map((message) => message.id.toString()),
      messages,
    );
  }

  async deleteMessage(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyMessages(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }

  async sendEmailDisclaimer(lead: LeadDocument) {
    if (lead.hasSendDisclaimer) {
      //throw new RpcException('Disclaimer has send');
      return true;
    }
    const domain = await this.getDomainCrm(lead.crm, true);
    try {
      if (domain) {
        const rta = await axios.post(this.url, {
          email: lead.email,
          domain: domain,
          name:
            lead.name ?? (lead.firstname ?? '') + ' ' + (lead.lastname ?? ''),
          apikey: this.apiKey,
        });
        this.builder.emitLeadEventClient(EventsNamesLeadEnum.updateOne, {
          id: lead._id,
          hasSendDisclaimer: true,
        });
        return true;
      }
      return null;
    } catch (err) {
      Logger.error(err, 'Error sending email');
      return null;
    }
  }
  async getDomainCrm(crmId: Crm, triggerError = false): Promise<string> {
    const crm: CrmInterface = await this.builder.getPromiseCrmEventClient(
      EventsNamesCrmEnum.findOneById,
      crmId,
    );
    if (triggerError && !crm?.clientZone) {
      //throw new RpcException(`Domain ${crm.name} has not found`);
    }
    return crm?.clientZone;
  }
}
