"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepsMartialLaw = exports.martialLawTable = exports.martialLawUnitLimit = void 0;
const Governments_1 = require("./Governments");
const martialLaw_1 = require("@civ-clone/base-government-martial-law/lib/martialLaw");
/**
 * Civilization II's martial law (OpenCiv2 `src/auto/city.cpp` `city_calc_trade_happiness`, richardpenman/civ2@49f26ec),
 * for the city happiness rules to apply with `base-government-martial-law`: under Anarchy, Despotism and Monarchy each
 * unit in the city with an attack makes 1 unhappy citizen content, up to 3; under Communism each makes 2, up to 6. None
 * under the other governments: Fundamentalism has no unhappy citizens at all, which is the happiness rules' to apply.
 */
exports.martialLawUnitLimit = 3;
exports.martialLawTable = [
    [Governments_1.Anarchy, { maximumUnits: exports.martialLawUnitLimit, perUnit: 1 }],
    [Governments_1.Despotism, { maximumUnits: exports.martialLawUnitLimit, perUnit: 1 }],
    [Governments_1.Monarchy, { maximumUnits: exports.martialLawUnitLimit, perUnit: 1 }],
    [Governments_1.Communism, { maximumUnits: exports.martialLawUnitLimit, perUnit: 2 }],
];
/** A unit that can keep martial law: any whose attack isn't 0. */
const keepsMartialLaw = (unit) => (0, martialLaw_1.hasAttack)(unit);
exports.keepsMartialLaw = keepsMartialLaw;
//# sourceMappingURL=martialLaw.js.map