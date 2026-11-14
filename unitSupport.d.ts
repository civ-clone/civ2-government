import Government from '@civ-clone/core-government/Government';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
/** How many of a city's units it supports for free, given its size. */
export type FreeUnits = (citySize: number) => number;
/** Each unit past the free ones costs this many shields. */
export declare const productionPerUnit = 1;
/**
 * Free units per city: as many as the city's size under Anarchy and Despotism, @COSMIC's numbers under Monarchy,
 * Communism and Fundamentalism (3, 3 and 8: the file's 10 is clamped to 8), and none under the Republic and Democracy.
 * Under Fundamentalism, units of a kind marked free of it (Fanatics) are never charged shields, but still take up one
 * of the 8 free places (`city_count_unit_support` counts every unit before it checks the mark): that is the unit
 * package's mark, for the city rules to apply.
 */
export declare const freeUnitsTable: [typeof Government, FreeUnits][];
/** The free units for a city of `citySize` under the player's government: 0 under one not in the table. */
export declare const freeUnits: (
  playerGovernment: PlayerGovernment,
  citySize: number
) => number;
/**
 * The food a city's settling units (Settlers, Engineers) each eat: @COSMIC's lower number up to Monarchy, the higher
 * from Communism on (the game compares the government's index, so Communism's settlers eat 2).
 */
export declare const settlerFoodTable: [typeof Government, number][];
/** The food each settling unit eats under the player's government. */
export declare const settlerFood: (
  playerGovernment: PlayerGovernment
) => number;
