import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  InteractionRegistry,
  instance as interactionRegistryInstance,
} from '@civ-clone/core-diplomacy/InteractionRegistry';
import {
  clearYieldCaches,
  emitGovernmentChanged,
  hasPlayerWorld,
} from '@civ-clone/base-government-change/lib/changed';
import { Anarchy, Fundamentalism } from '../../Governments';
import Changed from '@civ-clone/core-government/Rules/Changed';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Fanatic from '@civ-clone/base-unit-fanatic/Fanatic';
import Government from '@civ-clone/core-government/Government';
import High from '@civ-clone/core-rule/Priorities/High';
import Player from '@civ-clone/core-player/Player';
import Rifleman from '@civ-clone/base-unit-rifleman/Rifleman';
import { clearVendettasAgainst } from '@civ-clone/civ2-diplomacy/lib/relations';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';

export const getRules: (
  engine?: Engine,
  playerWorldRegistry?: PlayerWorldRegistry,
  interactionRegistry?: InteractionRegistry,
  clientRegistry?: ClientRegistry,
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry
) => Changed[] = (
  engine: Engine = engineInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  interactionRegistry: InteractionRegistry = interactionRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance
): Changed[] => [
  // Entering Anarchy, or any change of government by a computer player, ends every other player's vendetta against it
  //  (OpenCiv2 `src/auto/civ.cpp` `civ_set_government`, richardpenman/civ2@e39fe7b).
  new Changed(
    'civ2-government:player/government-changed/clear-vendettas',
    new High(),
    new Criterion(
      (player: Player, government: Government): boolean =>
        government instanceof Anarchy || !isHuman(player, clientRegistry)
    ),
    new Effect((player: Player): void =>
      clearVendettasAgainst(player, interactionRegistry)
    )
  ),
  // A person's cities building Fanatics switch to Riflemen under any government but Fundamentalism, keeping their
  //  shields (`civ_set_government`). A city that can't build Riflemen keeps the Fanatics for the build rules to
  //  cancel.
  new Changed(
    'civ2-government:player/government-changed/fanatics-to-riflemen',
    new High(),
    new Criterion(
      (player: Player, government: Government): boolean =>
        !(government instanceof Fundamentalism)
    ),
    new Criterion((player: Player): boolean => isHuman(player, clientRegistry)),
    new Effect((player: Player): void =>
      cityRegistry
        .getByPlayer(player)
        .flatMap((city) => cityBuildRegistry.getBy('city', city))
        .filter(
          (cityBuild: CityBuild): boolean =>
            cityBuild.building()?.item() === Fanatic
        )
        .forEach((cityBuild: CityBuild): void => {
          if (cityBuild.getAvailable(Rifleman)) {
            cityBuild.build(Rifleman);
          }
        })
    )
  ),
  new Changed(
    'civ2-government:player/government-changed/emit',
    new Effect(emitGovernmentChanged(engine))
  ),
  new Changed(
    'civ2-government:player/government-changed/clear-yield-caches',
    new Criterion(hasPlayerWorld(playerWorldRegistry)),
    new Effect(clearYieldCaches(playerWorldRegistry))
  ),
];

export default getRules;
