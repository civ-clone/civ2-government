"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settlerFood = exports.settlerFoodTable = exports.freeUnits = exports.freeUnitsTable = exports.productionPerUnit = void 0;
const Governments_1 = require("./Governments");
const cosmic_1 = require("@civ-clone/civ2-rules/data/cosmic");
/** Each unit past the free ones costs this many shields. */
exports.productionPerUnit = 1;
const citySize = (size) => size, fixed = (free) => () => free;
/**
 * Free units per city: as many as the city's size under Anarchy and Despotism, @COSMIC's numbers under Monarchy,
 * Communism and Fundamentalism (3, 3 and 8: the file's 10 is clamped to 8), and none under the Republic and Democracy.
 * Under Fundamentalism, units of a kind marked free of it (Fanatics) cost nothing at all and don't count: that is the
 * unit package's mark, for the city rules to exempt.
 */
exports.freeUnitsTable = [
    [Governments_1.Anarchy, citySize],
    [Governments_1.Despotism, citySize],
    [Governments_1.Monarchy, fixed(cosmic_1.default.monarchyFreeSupport)],
    [Governments_1.Communism, fixed(cosmic_1.default.communismFreeSupport)],
    [Governments_1.Fundamentalism, fixed(cosmic_1.default.fundamentalismFreeSupport)],
    [Governments_1.Republic, fixed(0)],
    [Governments_1.Democracy, fixed(0)],
];
/** The free units for a city of `citySize` under the player's government: 0 under one not in the table. */
const freeUnits = (playerGovernment, citySize) => {
    var _a, _b;
    return (_b = (_a = exports.freeUnitsTable.find(([GovernmentType]) => playerGovernment.is(GovernmentType))) === null || _a === void 0 ? void 0 : _a[1](citySize)) !== null && _b !== void 0 ? _b : 0;
};
exports.freeUnits = freeUnits;
/**
 * The food a city's settling units (Settlers, Engineers) each eat: @COSMIC's lower number up to Monarchy, the higher
 * from Communism on (the game compares the government's index, so Communism's settlers eat 2).
 */
exports.settlerFoodTable = [
    [Governments_1.Anarchy, cosmic_1.default.settlerFoodLow],
    [Governments_1.Despotism, cosmic_1.default.settlerFoodLow],
    [Governments_1.Monarchy, cosmic_1.default.settlerFoodLow],
    [Governments_1.Communism, cosmic_1.default.settlerFoodHigh],
    [Governments_1.Fundamentalism, cosmic_1.default.settlerFoodHigh],
    [Governments_1.Republic, cosmic_1.default.settlerFoodHigh],
    [Governments_1.Democracy, cosmic_1.default.settlerFoodHigh],
];
/** The food each settling unit eats under the player's government. */
const settlerFood = (playerGovernment) => {
    var _a, _b;
    return (_b = (_a = exports.settlerFoodTable.find(([GovernmentType]) => playerGovernment.is(GovernmentType))) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : cosmic_1.default.settlerFoodLow;
};
exports.settlerFood = settlerFood;
//# sourceMappingURL=unitSupport.js.map