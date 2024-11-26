import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '../casl-ability.factory';
import { IS_ANON } from '../decorators/allow-anon.decorator';
import { IS_API_KEY_CHECK } from '../decorators/api-key-check.decorator';
import { IS_REFRESH } from '../decorators/refresh.decorator';
import {
  CHECK_POLICIES_ABILITY_KEY,
  PolicyHandler,
} from '../policy/policy.handler.ability';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_ANON, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isRefresh = this.reflector.getAllAndOverride<boolean>(IS_REFRESH, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isApiKeyCheck = this.reflector.getAllAndOverride<boolean>(
      IS_API_KEY_CHECK,
      [context.getHandler(), context.getClass()],
    );
    const incomingMessage = context['args'] && context['args'][0];
    if (
      isApiKeyCheck &&
      !!incomingMessage &&
      (incomingMessage?.headers['affico-360-key'] ||
        incomingMessage?.headers['affico-360-affiliate-key'])
    ) {
      context['args'][0].body = context['args'][0].body ?? {};
      context['args'][0].body.checkApiKey = true;
    }
    if (isPublic || isRefresh || context['args'][0].body.checkApiKey) {
      return true;
    }
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_ABILITY_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = await this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability as AppAbility),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
