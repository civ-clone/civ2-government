import { Anarchy, Communism, Despotism, Monarchy } from './Governments';
import {
  MartialLawTable,
  hasAttack,
} from '@civ-clone/base-government-martial-law/lib/martialLaw';
import Unit from '@civ-clone/core-unit/Unit';

/**
 * Civilization II's martial law (OpenCiv2 `src/auto/city.cpp` `city_calc_trade_happiness`, richardpenman/civ2@49f26ec),
 * for the city happiness rules to apply with `base-government-martial-law`: under Anarchy, Despotism and Monarchy each
 * unit in the city with an attack makes 1 unhappy citizen content, up to 3; under Communism each makes 2, up to 6. None
 * under the other governments: Fundamentalism has no unhappy citizens at all, which is the happiness rules' to apply.
 */
export const martialLawUnitLimit = 3;

export const martialLawTable: MartialLawTable = [
  [Anarchy, { maximumUnits: martialLawUnitLimit, perUnit: 1 }],
  [Despotism, { maximumUnits: martialLawUnitLimit, perUnit: 1 }],
  [Monarchy, { maximumUnits: martialLawUnitLimit, perUnit: 1 }],
  [Communism, { maximumUnits: martialLawUnitLimit, perUnit: 2 }],
];

/** A unit that can keep martial law: any whose attack isn't 0. */
export const keepsMartialLaw = (unit: Unit): boolean => hasAttack(unit);
