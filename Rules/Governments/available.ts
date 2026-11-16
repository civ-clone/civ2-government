import { Anarchy, Democracy, Despotism, Monarchy } from '../../Governments';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Government from '@civ-clone/core-government/Government';
import GovernmentAvailable from '@civ-clone/base-government-change/Rules/GovernmentAvailable';
import Player from '@civ-clone/core-player/Player';
import governedBy from '@civ-clone/base-government-change/lib/governedBy';

export const getRules: (
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => GovernmentAvailable[] = (
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance
): GovernmentAvailable[] => [
  // Discovering a government's advance offers a revolution to it (OpenCiv2 `src/auto/civ.cpp`
  //  `civ_advance_gov_prompts`, richardpenman/civ2@e39fe7b): to Monarchy only from Despotism, and to any other
  //  government unless the player is under it already (base-government-change's own check), under Democracy or in
  //  Anarchy. The original asks only a person; this answers for every player and leaves the asking to the client.
  new GovernmentAvailable(
    'civ2-government:governments/available',
    new Effect((player: Player, GovernmentType: typeof Government): boolean =>
      GovernmentType === Monarchy
        ? governedBy(player, [Despotism], playerGovernmentRegistry)
        : !governedBy(player, [Democracy, Anarchy], playerGovernmentRegistry)
    )
  ),
];

export default getRules;
