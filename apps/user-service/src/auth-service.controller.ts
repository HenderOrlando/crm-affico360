import {
  Controller,
  Inject,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import ResponseAffico from '@response-affico/response-affico/models/ResponseAffico';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@auth/auth';
import { LocalAuthGuard } from '@auth/auth/guards/local.auth.guard';
import { AllowAnon } from '@auth/auth/decorators/allow-anon.decorator';
import { IsRefresh } from '@auth/auth/decorators/refresh.decorator';
import { ApiKeyCheck } from '@auth/auth/decorators/api-key-check.decorator';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import ActionsEnum from '@common/common/enums/ActionEnum';
import EventsNamesActivityEnum from 'apps/activity-service/src/enum/events.names.activity.enum';
import EventsNamesUserEnum from './enum/events.names.user.enum';
import { BuildersService } from '@builder/builders';
import { CommonService } from '@common/common';
import { ConfigService } from '@nestjs/config';

@ApiTags('AUTHENTICATION')
@Controller('auth')
export class AuthServiceController {
  private eventClient: ClientProxy;
  constructor(
    @Inject(BuildersService)
    private builder: BuildersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.eventClient = this.builder.getEventClient();
  }

  @AllowAnon()
  @ApiKeyCheck()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiResponse(ResponseAffico.getResponseSwagger(200))
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async authenticate(@Request() req) {
    const user = req.user;
    if (req.body.code && !user.twoFactorIsActive) {
      // Validated Two Factor Authentication
      this.authService.activeTwoFactor(user.id);
      user.twoFactorIsActive = true;
      delete user.twoFactorQr;
      delete user.twoFactorSecret;
    }
    return this.authorizationEvent({
      user: user,
      code: req.body.code,
    });
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.authorization)
  async authorizationEvent(
    @Payload() userCodeDto: UserCodeDto,
    @Ctx() ctx?: RmqContext,
  ) {
    CommonService.ack(ctx);
    const g2fa = this.configService.get<string>('GOOGLE_2FA');
    if (this.configService.get<string>('GOOGLE_2FA') === 'true') {
      if (!!userCodeDto.user.twoFactorIsActive || !!userCodeDto.code) {
        // Get token
        let rta = {
          statusCode: 201,
          access_token: await this.authService.getTokenData(userCodeDto.user),
        };
        if (userCodeDto.user.apiData) {
          // If query is from the software with ApiKey, return he user
          rta = userCodeDto.user;
        }
        this.registerActivity({
          resource: ResourcesEnum.USER,
          action: ActionsEnum.LOGIN,
          creator: userCodeDto.user.id,
          object: userCodeDto.user,
        });
        return rta;
      }

      if (!userCodeDto.user.twoFactorQr) {
        userCodeDto.user = await this.authService.updateTwoFactor(
          userCodeDto.user.id,
        );
        this.registerActivity({
          resource: ResourcesEnum.USER,
          action: ActionsEnum.UPDATE,
          creator: userCodeDto.user.id,
          object: userCodeDto.user,
        });
      }
      return {
        statusCode: 202,
        data: userCodeDto.user.twoFactorQr,
      };
    }
    userCodeDto.user.twoFactorIsActive = true;
    delete userCodeDto.user.twoFactorQr;
    delete userCodeDto.user.twoFactorSecret;
    delete userCodeDto.user.twoFactorIsActive;
    // Get token
    let rta = {
      statusCode: 201,
      access_token: await this.authService.getTokenData(userCodeDto.user),
    };
    if (userCodeDto.user.apiData) {
      // If query is from the software with ApiKey, return he user
      rta = userCodeDto.user;
    }
    this.registerActivity({
      resource: ResourcesEnum.USER,
      action: ActionsEnum.LOGIN,
      creator: userCodeDto.user.id,
      object: userCodeDto.user,
    });
    return rta;
  }

  @IsRefresh()
  @Patch('refresh')
  @ApiResponse(ResponseAffico.getResponseSwagger(200))
  @ApiResponse(ResponseAffico.getResponseSwagger(400))
  @ApiResponse(ResponseAffico.getResponseSwagger(403))
  async refreshToken(@Request() req) {
    const { authorization } = req.headers;
    return this.refreshTokenEvent(authorization);
  }

  @AllowAnon()
  @MessagePattern(EventsNamesUserEnum.refreshToken)
  async refreshTokenEvent(@Payload() token, @Ctx() ctx?: RmqContext) {
    CommonService.ack(ctx);
    const { access_token, user } = await this.authService.refreshTokenUser(
      token,
    );
    this.registerActivity({
      resource: ResourcesEnum.USER,
      action: ActionsEnum.LOGIN,
      creator: user.id,
      object: user,
    });
    return { access_token };
  }

  private registerActivity(data: any) {
    this.builder.emitActivityEventClient(
      EventsNamesActivityEnum.registerActivity,
      data,
    );
  }
}

interface UserCodeDto {
  user: any;
  code: string;
}
