import Government from '@civ-clone/core-government/Government';
import { MilitaryUnhappinessTable } from '@civ-clone/base-government-military-unhappiness/lib/militaryUnhappiness';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
/**
 * Civilization II's military unhappiness (OpenCiv2 `src/auto/city.cpp` `city_calc_trade_happiness`,
 * richardpenman/civ2@49f26ec), for the city happiness rules to apply with `base-government-military-unhappiness`: each
 * aggressive unit a city supports makes 1 citizen unhappy under the Republic and 2 under Democracy.
 */
export declare const militaryUnhappinessTable: MilitaryUnhappinessTable;
/** Under the Republic the city's first aggressive unit makes nobody unhappy. */
export declare const freeAggressiveUnitsTable: [typeof Government, number][];
/** How many of a city's aggressive units make nobody unhappy under the player's government. */
export declare const freeAggressiveUnits: (
  playerGovernment: PlayerGovernment
) => number;
/**
 * A Police Station in the city, or the Women's Suffrage, takes 1 off each aggressive unit's unhappiness: none under the
 * Republic, 1 under Democracy. For an exemption (`MilitaryUnhappinessExemption`) once those exist.
 */
export declare const policeStationExemption = 1;
