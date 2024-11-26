import { AffiliateServiceMongooseService } from '@affiliate/affiliate';
import { BuildersService } from '@builder/builders';
import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import EventsNamesAffiliateEnum from 'apps/affiliate-service/src/enum/events.names.affiliate.enum';
@Injectable()
export class ApiKeyAffiliateAuthGuard extends AuthGuard('api-key-affiliate') {
  constructor(
    @Inject(AffiliateServiceMongooseService)
    private readonly affiliateService: AffiliateServiceMongooseService,
    @Inject(BuildersService)
    private readonly builder: BuildersService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const apiKey =
      request.headers['affico-360-affiliate-key'] ??
      request.query['affico-360-affiliate-key'];
    if (!apiKey) {
      throw new UnauthorizedException('Not found affiliate key');
    }
    const affiliate = await this.builder.getPromiseAffiliateEventClient(
      EventsNamesAffiliateEnum.findOneByPublicKey,
      apiKey,
    );
    if (!affiliate) {
      throw new UnauthorizedException('Not found affiliate with key');
    }
    request['affiliate'] = affiliate._id;
    delete request.body['checkApiKey'];
    return true;
  }
  handleRequest(err, affiliate /* , info */) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !affiliate) {
      throw err || new UnauthorizedException();
    }
    return affiliate;
  }
}
