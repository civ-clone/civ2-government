import {
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import { acceptRevolutionOffer, pendingRevolution } from '../../lib/revolution';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import SenateScandal from '@civ-clone/civ2-diplomacy/Rules/SenateScandal';

/**
 * A Senate's scandal brings the government down (OpenCiv2 `civ_change_government(civ, 0)` after a refused withdrawal,
 *  `diplomacy.cpp:6405`, and an espionage incident under a treaty, `:5318`). civ2-diplomacy decides whether there is
 *  one (`senateScandal`: Democracy always, a Republic one time in two); here the player falls into Anarchy, as a
 *  revolution of its own would (the original sets Anarchy without `CIVF_REVOLUTION`, so it lasts to the next turn that
 *  is a multiple of 4), even in a turn it chose a government. `civ2-government:senate-scandal` (player, other) is
 *  emitted for a notice.
 */
export const getRules: (
  engine?: Pick<Engine, 'emit'>,
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  pendingEffects?: PendingEffectRegistry,
  ruleRegistry?: RuleRegistry,
  turn?: Turn
) => SenateScandal[] = (
  engine?: Pick<Engine, 'emit'>,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance
): SenateScandal[] => [
  new SenateScandal(
    'civ2-government:player/senate-scandal/anarchy',
    new Effect((player: Player, other: Player): void => {
      const playerGovernment = playerGovernmentRegistry.getByPlayer(player);

      if (pendingRevolution(playerGovernment, pendingEffects) !== null) {
        return;
      }

      acceptRevolutionOffer(
        playerGovernment,
        pendingEffects,
        ruleRegistry,
        turn
      );

      engine?.emit('civ2-government:senate-scandal', player, other);
    })
  ),
];

export default getRules;
