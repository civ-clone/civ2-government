"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policeStationExemption = exports.freeAggressiveUnits = exports.freeAggressiveUnitsTable = exports.militaryUnhappinessTable = void 0;
const Governments_1 = require("./Governments");
/**
 * Civilization II's military unhappiness (OpenCiv2 `src/auto/city.cpp` `city_calc_trade_happiness`,
 * richardpenman/civ2@49f26ec), for the city happiness rules to apply with `base-government-military-unhappiness`: each
 * aggressive unit a city supports makes 1 citizen unhappy under the Republic and 2 under Democracy.
 */
exports.militaryUnhappinessTable = [
    [Governments_1.Republic, 1],
    [Governments_1.Democracy, 2],
];
/** Under the Republic the city's first aggressive unit makes nobody unhappy. */
exports.freeAggressiveUnitsTable = [
    [Governments_1.Republic, 1],
];
/** How many of a city's aggressive units make nobody unhappy under the player's government. */
const freeAggressiveUnits = (playerGovernment) => {
    var _a, _b;
    return (_b = (_a = exports.freeAggressiveUnitsTable.find(([GovernmentType]) => playerGovernment.is(GovernmentType))) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0;
};
exports.freeAggressiveUnits = freeAggressiveUnits;
/**
 * A Police Station in the city, or the Women's Suffrage, takes 1 off each aggressive unit's unhappiness: none under the
 * Republic, 1 under Democracy. For an exemption (`MilitaryUnhappinessExemption`) once those exist.
 */
exports.policeStationExemption = 1;
//# sourceMappingURL=militaryUnhappiness.js.map