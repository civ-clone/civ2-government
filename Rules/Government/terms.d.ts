import Government from '@civ-clone/core-government/Government';
import GovernmentTerms from '@civ-clone/base-government-terms/Rules/GovernmentTerms';
import { Terms } from '@civ-clone/base-government-terms/lib/terms';
/**
 * What each of Civilization II's governments does, from this package's tables (`unitSupport`, `martialLaw`,
 *  `militaryUnhappiness`) and @COSMIC's science loss, as base-government-terms' `GovernmentTerms`, for a player or its
 *  AI to compare governments with. Asked by nothing in the rules themselves. What a government does to a city's
 *  squares and its corruption is civ2-city's.
 */
export declare const terms: (
  GovernmentType: typeof Government
) => Partial<Terms>;
export declare const getRules: () => GovernmentTerms[];
export default getRules;
