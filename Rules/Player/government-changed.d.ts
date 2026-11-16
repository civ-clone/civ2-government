import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { InteractionRegistry } from '@civ-clone/core-diplomacy/InteractionRegistry';
import Changed from '@civ-clone/core-government/Rules/Changed';
export declare const getRules: (
  engine?: Engine,
  playerWorldRegistry?: PlayerWorldRegistry,
  interactionRegistry?: InteractionRegistry,
  clientRegistry?: ClientRegistry,
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry
) => Changed[];
export default getRules;
