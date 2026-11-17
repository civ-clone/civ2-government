import { PendingEffectRegistry } from '@civ-clone/core-pending-effect';
import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import Engine from '@civ-clone/core-engine/Engine';
import SenateScandal from '@civ-clone/civ2-diplomacy/Rules/SenateScandal';
/**
 * A Senate's scandal brings the government down (OpenCiv2 `civ_change_government(civ, 0)` after a refused withdrawal,
 *  `diplomacy.cpp:6405`, and an espionage incident under a treaty, `:5318`). civ2-diplomacy decides whether there is
 *  one (`senateScandal`: Democracy always, a Republic one time in two); here the player falls into Anarchy, as a
 *  revolution of its own would (the original sets Anarchy without `CIVF_REVOLUTION`, so it lasts to the next turn that
 *  is a multiple of 4), even in a turn it chose a government. `civ2-government:senate-scandal` (player, other) is
 *  emitted for a notice.
 */
export declare const getRules: (
  engine?: Pick<Engine, 'emit'>,
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  pendingEffects?: PendingEffectRegistry,
  ruleRegistry?: RuleRegistry,
  turn?: Turn
) => SenateScandal[];
export default getRules;
