import ActionsEnum from '@common/common/enums/ActionEnum';
import ResourcesEnum from '@common/common/enums/ResourceEnum';
import { AppAbility } from '../../casl-ability.factory';
import { IPolicyHandler } from '../policy.handler.ability';

export class PolicyHandlerStatsTransferAll implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(ActionsEnum.ALL, ResourcesEnum.STATS_TRANSFER);
  }
}
