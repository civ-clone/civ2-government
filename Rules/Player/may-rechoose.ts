import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import MayRechoose from '@civ-clone/base-government-change/Rules/MayRechoose';
import Player from '@civ-clone/core-player/Player';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';

export const getRules: (clientRegistry?: ClientRegistry) => MayRechoose[] = (
  clientRegistry: ClientRegistry = clientRegistryInstance
): MayRechoose[] => [
  // In the turn a person chose a government, Revolution opens the choice again with no Anarchy (OpenCiv2
  //  `src/auto/window.cpp` `menu_revolution`, while `CIVF_GOV_CHANGED`, richardpenman/civ2@e39fe7b). It's the person's
  //  menu: computer players change government without it.
  new MayRechoose(
    'civ2-government:player/may-rechoose',
    new Effect((player: Player): boolean => isHuman(player, clientRegistry))
  ),
];

export default getRules;
