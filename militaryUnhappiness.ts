import { Democracy, Republic } from './Governments';
import Government from '@civ-clone/core-government/Government';
import { MilitaryUnhappinessTable } from '@civ-clone/base-government-military-unhappiness/lib/militaryUnhappiness';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';

/**
 * Civilization II's military unhappiness (OpenCiv2 `src/auto/city.cpp` `city_calc_trade_happiness`,
 * richardpenman/civ2@49f26ec), for the city happiness rules to apply with `base-government-military-unhappiness`: each
 * aggressive unit a city supports makes 1 citizen unhappy under the Republic and 2 under Democracy.
 */
export const militaryUnhappinessTable: MilitaryUnhappinessTable = [
  [Republic, 1],
  [Democracy, 2],
];

/** Under the Republic the city's first aggressive unit makes nobody unhappy. */
export const freeAggressiveUnitsTable: [typeof Government, number][] = [
  [Republic, 1],
];

/** How many of a city's aggressive units make nobody unhappy under the player's government. */
export const freeAggressiveUnits = (
  playerGovernment: PlayerGovernment
): number =>
  freeAggressiveUnitsTable.find(([GovernmentType]) =>
    playerGovernment.is(GovernmentType)
  )?.[1] ?? 0;

/**
 * A Police Station in the city, or the Women's Suffrage, takes 1 off each aggressive unit's unhappiness: none under the
 * Republic, 1 under Democracy. For an exemption (`MilitaryUnhappinessExemption`) once those exist.
 */
export const policeStationExemption = 1;
