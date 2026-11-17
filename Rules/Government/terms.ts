import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from '../../Governments';
import {
  freeAggressiveUnitsTable,
  militaryUnhappinessTable,
} from '../../militaryUnhappiness';
import { freeUnitsTable, productionPerUnit } from '../../unitSupport';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Government from '@civ-clone/core-government/Government';
import GovernmentTerms from '@civ-clone/base-government-terms/Rules/GovernmentTerms';
import { Terms } from '@civ-clone/base-government-terms/lib/terms';
import cosmic from '@civ-clone/civ2-rules/data/cosmic';
import { martialLawTable } from '../../martialLaw';

const governments: (typeof Government)[] = [
  Anarchy,
  Despotism,
  Monarchy,
  Communism,
  Fundamentalism,
  Republic,
  Democracy,
];

// The row of `table` for `GovernmentType`, matched as `PlayerGovernment#is` matches: by class, a subclass included.
const rowOf = <T>(
  table: [typeof Government, T][],
  GovernmentType: typeof Government
): T | undefined =>
  table.find(
    ([TableType]) =>
      GovernmentType === TableType ||
      GovernmentType.prototype instanceof TableType
  )?.[1];

/**
 * What each of Civilization II's governments does, from this package's tables (`unitSupport`, `martialLaw`,
 *  `militaryUnhappiness`) and @COSMIC's science loss, as base-government-terms' `GovernmentTerms`, for a player or its
 *  AI to compare governments with. Asked by nothing in the rules themselves. What a government does to a city's
 *  squares and its corruption is civ2-city's.
 */
export const terms = (GovernmentType: typeof Government): Partial<Terms> => ({
  freeUnits: rowOf(freeUnitsTable, GovernmentType) ?? ((): number => 0),
  unitSupportCost: productionPerUnit,
  martialLaw: rowOf(martialLawTable, GovernmentType) ?? {
    maximumUnits: 0,
    perUnit: 1,
  },
  militaryUnhappiness: {
    perUnit: rowOf(militaryUnhappinessTable, GovernmentType) ?? 0,
    free: rowOf(freeAggressiveUnitsTable, GovernmentType) ?? 0,
  },
  noUnhappiness: rowOf([[Fundamentalism, true]], GovernmentType) ?? false,
  science:
    rowOf(
      [[Fundamentalism, (100 - cosmic.fundamentalismScienceLoss) / 100]],
      GovernmentType
    ) ?? 1,
});

export const getRules = (): GovernmentTerms[] => [
  new GovernmentTerms(
    'civ2-government:government/terms',
    new Criterion((GovernmentType: typeof Government): boolean =>
      governments.some(
        (Known: typeof Government): boolean =>
          GovernmentType === Known || GovernmentType.prototype instanceof Known
      )
    ),
    new Effect(terms)
  ),
];

export default getRules;
