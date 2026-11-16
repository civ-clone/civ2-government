"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Governments_1 = require("../../Governments");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const GovernmentAvailable_1 = require("@civ-clone/base-government-change/Rules/GovernmentAvailable");
const governedBy_1 = require("@civ-clone/base-government-change/lib/governedBy");
const getRules = (playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance) => [
    // Discovering a government's advance offers a revolution to it (OpenCiv2 `src/auto/civ.cpp`
    //  `civ_advance_gov_prompts`, richardpenman/civ2@e39fe7b): to Monarchy only from Despotism, and to any other
    //  government unless the player is under it already (base-government-change's own check), under Democracy or in
    //  Anarchy. The original asks only a person; this answers for every player and leaves the asking to the client.
    new GovernmentAvailable_1.default('civ2-government:governments/available', new Effect_1.default((player, GovernmentType) => GovernmentType === Governments_1.Monarchy
        ? (0, governedBy_1.default)(player, [Governments_1.Despotism], playerGovernmentRegistry)
        : !(0, governedBy_1.default)(player, [Governments_1.Democracy, Governments_1.Anarchy], playerGovernmentRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=available.js.map