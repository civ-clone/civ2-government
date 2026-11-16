import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
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
import Complete from '@civ-clone/core-science/Rules/Complete';
import Effect from '@civ-clone/core-rule/Effect';
import { REVOLUTION } from '../../lib/revolution';
import availability from '../../Requirements';
import offerGovernments from '@civ-clone/base-government-change/lib/offer';

export const getRules: (
  playerGovernmentRegistry?: PlayerGovernmentRegistry,
  pendingEffects?: PendingEffectRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => Complete[] = (
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  engine: Engine = engineInstance
): Complete[] => [
  // An advance that opens a government offers a revolution to it, as `Rules/Governments/available` says
  //  (`civ_advance_gov_prompts`): the engine emits `player:government:available` with the player and the government.
  //  Nothing is offered while a revolution is under way. Accepting it is starting a revolution, so Anarchy.
  new Complete(
    'civ2-government:research/complete/offer-revolution',
    new Effect(
      offerGovernments(
        REVOLUTION,
        availability,
        playerGovernmentRegistry,
        pendingEffects,
        ruleRegistry,
        engine
      )
    )
  ),
];

export default getRules;
