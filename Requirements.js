"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availability = void 0;
const Governments_1 = require("./Governments");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const Communism_1 = require("@civ-clone/base-science-advance-communism/Communism");
const Democracy_1 = require("@civ-clone/base-science-advance-democracy/Democracy");
const Fundamentalism_1 = require("@civ-clone/base-science-advance-fundamentalism/Fundamentalism");
const Monarchy_1 = require("@civ-clone/base-science-advance-monarchy/Monarchy");
const TheRepublic_1 = require("@civ-clone/base-science-advance-therepublic/TheRepublic");
/**
 * The advance a player needs before it may choose each of Civilization II's governments (OpenCiv2 `src/auto/civ.cpp`
 * `civ_can_choose_government`, richardpenman/civ2@49f26ec): one rule each, made by `Rules/Governments/availability`.
 * Despotism needs none. A government is available by any rule that allows it, so each entry is one way to it: the
 * Statue of Liberty's way (any government) is a rule of the Wonders' own.
 */
exports.availability = (0, Requirement_1.table)('civ2-government:governments/availability', 'requires', [
    [Governments_1.Despotism],
    [Governments_1.Monarchy, Monarchy_1.default],
    [Governments_1.Communism, Communism_1.default],
    [Governments_1.Fundamentalism, Fundamentalism_1.default],
    [Governments_1.Republic, TheRepublic_1.default],
    [Governments_1.Democracy, Democracy_1.default],
]);
exports.default = exports.availability;
//# sourceMappingURL=Requirements.js.map