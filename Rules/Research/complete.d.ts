import { Engine } from '@civ-clone/core-engine/Engine';
import { PendingEffectRegistry } from '@civ-clone/core-pending-effect';
import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Complete from '@civ-clone/core-science/Rules/Complete';
export declare const getRules: (
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  pendingEffects?: PendingEffectRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => Complete[];
export default getRules;
