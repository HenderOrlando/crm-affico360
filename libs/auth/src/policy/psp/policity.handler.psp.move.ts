import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { AppAbility } from '../../casl-ability.factory';
import { IPolicyHandler } from '../policy.handler.ability';

export class PolicyHandlerPspMove implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(ActionsEnum.MOVE, ResourcesEnum.PSP);
  }
}
