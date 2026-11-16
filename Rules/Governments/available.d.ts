import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import GovernmentAvailable from '@civ-clone/base-government-change/Rules/GovernmentAvailable';
export declare const getRules: (
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => GovernmentAvailable[];
export default getRules;
