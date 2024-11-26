import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { AppAbility } from '../../casl-ability.factory';
import { IPolicyHandler } from '../policy.handler.ability';

export class PolicyHandlerLeadCreateTransfer implements IPolicyHandler {
  handle(ability: AppAbility) {
    return (
      ability.can(ActionsEnum.UPDATE, ResourcesEnum.LEAD) &&
      ability.can(ActionsEnum.CREATE, ResourcesEnum.TRANSFER)
    );
  }
}