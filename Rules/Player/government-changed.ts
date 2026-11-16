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
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Fanatic from '@civ-clone/base-unit-fanatic/Fanatic';
import Government from '@civ-clone/core-government/Government';
import High from '@civ-clone/core-rule/Priorities/High';
import Low from '@civ-clone/core-rule/Priorities/Low';
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
): Changed[] => {
  // The government each player was last seen to have, so the rules below act only on an actual change, as
  //  `civ_set_government` does (`if (government != old_government)`). Not saved: after a game is loaded, a player's
  //  first change counts as one.
  const lastSeen = new WeakMap<Player, Function>(),
    isChange = (player: Player, government: Government): boolean =>
      lastSeen.get(player) !== government.constructor;

  return [
    // Entering Anarchy, or any change of government by a computer player, ends every other player's vendetta against
    //  it (OpenCiv2 `src/auto/civ.cpp` `civ_set_government`, richardpenman/civ2@e39fe7b).
    new Changed(
      'civ2-government:player/government-changed/clear-vendettas',
      new High(),
      new Criterion(isChange),
      new Criterion(
        (player: Player, government: Government): boolean =>
          government instanceof Anarchy || !isHuman(player, clientRegistry)
      ),
      new Effect((player: Player): void =>
        clearVendettasAgainst(player, interactionRegistry)
      )
    ),
    // A person's cities building Fanatics switch to Riflemen under any government but Fundamentalism, keeping their
    //  shields (`civ_set_government`). The original sets the city's production whether or not it could choose
    //  Riflemen, so a city that can't is given them all the same.
    new Changed(
      'civ2-government:player/government-changed/fanatics-to-riflemen',
      new High(),
      new Criterion(isChange),
      new Criterion(
        (player: Player, government: Government): boolean =>
          !(government instanceof Fundamentalism)
      ),
      new Criterion((player: Player): boolean =>
        isHuman(player, clientRegistry)
      ),
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

              return;
            }

            // `build` refuses an item the city can't choose, so the item is set directly, then priced by the city's
            //  own rules (`reprice`), progress kept.
            (cityBuild as unknown as { _building: BuildItem })._building =
              new BuildItem(Rifleman, cityBuild.city());
            cityBuild.reprice();
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
    // Last, after every rule that asks whether this is a change.
    new Changed(
      'civ2-government:player/government-changed/last-seen',
      new Low(),
      new Effect((player: Player, government: Government): void => {
        lastSeen.set(player, government.constructor);
      })
    ),
  ];
};

export default getRules;
