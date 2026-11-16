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
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  clearYieldCaches,
  emitGovernmentChanged,
  hasPlayerWorld,
} from '@civ-clone/base-government-change/lib/changed';
import { Anarchy, Fundamentalism } from '../../Governments';
import Changed from '@civ-clone/core-government/Rules/Changed';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import { IBuildable as Buildable } from '@civ-clone/core-city-build/Buildable';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Fanatic from '@civ-clone/base-unit-fanatic/Fanatic';
import Government from '@civ-clone/core-government/Government';
import High from '@civ-clone/core-rule/Priorities/High';
import Low from '@civ-clone/core-rule/Priorities/Low';
import Player from '@civ-clone/core-player/Player';
import Rifleman from '@civ-clone/base-unit-rifleman/Rifleman';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import { clearVendettasAgainst } from '@civ-clone/civ2-diplomacy/lib/relations';
import isHuman from '@civ-clone/base-difficulty/lib/isHuman';

/**
 * Sets `cityBuild` to `Item` as `CityBuild#build` does, but without asking whether the city may choose it, which
 *  `build` refuses: the original sets the production whether or not it could be chosen. Everything else `build` does is
 *  kept: the cost, the item cleared, the last queue move's dropped items forgotten, and the `ProductionChanged` rules
 *  asked from what the build had at the turn's start, so a change back later in the turn is still measured from there.
 *  core-city-build has no public way to do this.
 */
export const giveRegardless = (cityBuild: CityBuild, Item: Buildable): void => {
  const build = cityBuild as unknown as {
      _building: BuildItem | null;
      _cleared: unknown;
      _queueDropped: Buildable[];
      _ruleRegistry: RuleRegistry;
      productionChanged(previous: Buildable | null, to: Buildable): void;
    },
    previous = cityBuild.building()?.item() ?? null;

  build._building = new BuildItem(Item, cityBuild.city(), build._ruleRegistry);
  build._cleared = null;
  cityBuild.cost().set(build._building.cost().value());
  build._queueDropped = [];
  build.productionChanged(previous, Item);
};

export const getRules: (
  engine?: Engine,
  playerWorldRegistry?: PlayerWorldRegistry,
  interactionRegistry?: InteractionRegistry,
  clientRegistry?: ClientRegistry,
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => (Changed | TurnStart)[] = (
  engine: Engine = engineInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  interactionRegistry: InteractionRegistry = interactionRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance
): (Changed | TurnStart)[] => {
  // The government each player was last seen to have, so the rules below act only on an actual change, as
  //  `civ_set_government` does (`if (government != old_government)`). Not saved: it is filled in at each turn's start
  //  for any player it doesn't have yet (one from a loaded game), so setting a loaded player's government again isn't a
  //  change.
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

            giveRegardless(cityBuild, Rifleman);
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
    // At a turn's start, the government of a player not seen yet (as one from a loaded game).
    new TurnStart(
      'civ2-government:player/turn-start/last-seen',
      new Criterion((player: Player): boolean => !lastSeen.has(player)),
      new Effect((player: Player): void => {
        const current = playerGovernmentRegistry
          .getBy('player', player)[0]
          ?.current();

        if (current) {
          lastSeen.set(player, current.constructor);
        }
      })
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
