import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../casl-ability.factory';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_ABILITY_KEY = 'check_policy_ability';
export const CheckPoliciesAbility = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_ABILITY_KEY, handlers);
