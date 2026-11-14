import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from './Governments';
import Government from '@civ-clone/core-government/Government';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import cosmic from '@civ-clone/civ2-rules/data/cosmic';

// Civilization II's unit support by government, for the city rules to apply with `base-government-unit-support`
//  (OpenCiv2 `src/auto/city.cpp` `city_count_unit_support` and `city_calc_food_box_rows`, richardpenman/civ2@49f26ec).
//  The numbers come from @COSMIC (civ2-rules `cosmic`), as the game reads them.

/** How many of a city's units it supports for free, given its size. */
export type FreeUnits = (citySize: number) => number;

/** Each unit past the free ones costs this many shields. */
export const productionPerUnit = 1;

const citySize: FreeUnits = (size: number): number => size,
  fixed =
    (free: number): FreeUnits =>
    (): number =>
      free;

/**
 * Free units per city: as many as the city's size under Anarchy and Despotism, @COSMIC's numbers under Monarchy,
 * Communism and Fundamentalism (3, 3 and 8: the file's 10 is clamped to 8), and none under the Republic and Democracy.
 * Under Fundamentalism, units of a kind marked free of it (Fanatics) are never charged shields, but still take up one
 * of the 8 free places (`city_count_unit_support` counts every unit before it checks the mark): that is the unit
 * package's mark, for the city rules to apply.
 */
export const freeUnitsTable: [typeof Government, FreeUnits][] = [
  [Anarchy, citySize],
  [Despotism, citySize],
  [Monarchy, fixed(cosmic.monarchyFreeSupport)],
  [Communism, fixed(cosmic.communismFreeSupport)],
  [Fundamentalism, fixed(cosmic.fundamentalismFreeSupport)],
  [Republic, fixed(0)],
  [Democracy, fixed(0)],
];

/** The free units for a city of `citySize` under the player's government: 0 under one not in the table. */
export const freeUnits = (
  playerGovernment: PlayerGovernment,
  citySize: number
): number =>
  freeUnitsTable.find(([GovernmentType]) =>
    playerGovernment.is(GovernmentType)
  )?.[1](citySize) ?? 0;

/**
 * The food a city's settling units (Settlers, Engineers) each eat: @COSMIC's lower number up to Monarchy, the higher
 * from Communism on (the game compares the government's index, so Communism's settlers eat 2).
 */
export const settlerFoodTable: [typeof Government, number][] = [
  [Anarchy, cosmic.settlerFoodLow],
  [Despotism, cosmic.settlerFoodLow],
  [Monarchy, cosmic.settlerFoodLow],
  [Communism, cosmic.settlerFoodHigh],
  [Fundamentalism, cosmic.settlerFoodHigh],
  [Republic, cosmic.settlerFoodHigh],
  [Democracy, cosmic.settlerFoodHigh],
];

/** The food each settling unit eats under the player's government. */
export const settlerFood = (playerGovernment: PlayerGovernment): number =>
  settlerFoodTable.find(([GovernmentType]) =>
    playerGovernment.is(GovernmentType)
  )?.[1] ?? cosmic.settlerFoodLow;
