import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { InteractionRegistry } from '@civ-clone/core-diplomacy/InteractionRegistry';
import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import Changed from '@civ-clone/core-government/Rules/Changed';
import { IBuildable as Buildable } from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
/**
 * Sets `cityBuild` to `Item` as `CityBuild#build` does, but without asking whether the city may choose it, which
 *  `build` refuses: the original sets the production whether or not it could be chosen. Everything else `build` does is
 *  kept: the cost, the item cleared, the last queue move's dropped items forgotten, and the `ProductionChanged` rules
 *  asked from what the build had at the turn's start, so a change back later in the turn is still measured from there.
 *  core-city-build has no public way to do this.
 */
export declare const giveRegardless: (
  cityBuild: CityBuild,
  Item: Buildable
) => void;
export declare const getRules: (
  engine?: Engine,
  playerWorldRegistry?: PlayerWorldRegistry,
  interactionRegistry?: InteractionRegistry,
  clientRegistry?: ClientRegistry,
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => (Changed | TurnStart)[];
export default getRules;
