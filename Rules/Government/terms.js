"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.terms = void 0;
const Governments_1 = require("../../Governments");
const militaryUnhappiness_1 = require("../../militaryUnhappiness");
const unitSupport_1 = require("../../unitSupport");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const GovernmentTerms_1 = require("@civ-clone/base-government-terms/Rules/GovernmentTerms");
const cosmic_1 = require("@civ-clone/civ2-rules/data/cosmic");
const martialLaw_1 = require("../../martialLaw");
const governments = [
    Governments_1.Anarchy,
    Governments_1.Despotism,
    Governments_1.Monarchy,
    Governments_1.Communism,
    Governments_1.Fundamentalism,
    Governments_1.Republic,
    Governments_1.Democracy,
];
// The row of `table` for `GovernmentType`, matched as `PlayerGovernment#is` matches: by class, a subclass included.
const rowOf = (table, GovernmentType) => {
    var _a;
    return (_a = table.find(([TableType]) => GovernmentType === TableType ||
        GovernmentType.prototype instanceof TableType)) === null || _a === void 0 ? void 0 : _a[1];
};
/**
 * What each of Civilization II's governments does, from this package's tables (`unitSupport`, `martialLaw`,
 *  `militaryUnhappiness`) and @COSMIC's science loss, as base-government-terms' `GovernmentTerms`, for a player or its
 *  AI to compare governments with. Asked by nothing in the rules themselves. What a government does to a city's
 *  squares and its corruption is civ2-city's.
 */
const terms = (GovernmentType) => {
    var _a, _b, _c, _d, _e, _f;
    return ({
        freeUnits: (_a = rowOf(unitSupport_1.freeUnitsTable, GovernmentType)) !== null && _a !== void 0 ? _a : (() => 0),
        unitSupportCost: unitSupport_1.productionPerUnit,
        martialLaw: (_b = rowOf(martialLaw_1.martialLawTable, GovernmentType)) !== null && _b !== void 0 ? _b : {
            maximumUnits: 0,
            perUnit: 1,
        },
        militaryUnhappiness: {
            perUnit: (_c = rowOf(militaryUnhappiness_1.militaryUnhappinessTable, GovernmentType)) !== null && _c !== void 0 ? _c : 0,
            free: (_d = rowOf(militaryUnhappiness_1.freeAggressiveUnitsTable, GovernmentType)) !== null && _d !== void 0 ? _d : 0,
        },
        noUnhappiness: (_e = rowOf([[Governments_1.Fundamentalism, true]], GovernmentType)) !== null && _e !== void 0 ? _e : false,
        science: (_f = rowOf([[Governments_1.Fundamentalism, (100 - cosmic_1.default.fundamentalismScienceLoss) / 100]], GovernmentType)) !== null && _f !== void 0 ? _f : 1,
    });
};
exports.terms = terms;
const getRules = () => [
    new GovernmentTerms_1.default('civ2-government:government/terms', new Criterion_1.default((GovernmentType) => governments.some((Known) => GovernmentType === Known || GovernmentType.prototype instanceof Known)), new Effect_1.default(exports.terms)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=terms.js.map