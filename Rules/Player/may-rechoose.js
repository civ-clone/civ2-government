"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const MayRechoose_1 = require("@civ-clone/base-government-change/Rules/MayRechoose");
const isHuman_1 = require("@civ-clone/base-difficulty/lib/isHuman");
const getRules = (clientRegistry = ClientRegistry_1.instance) => [
    // In the turn a person chose a government, Revolution opens the choice again with no Anarchy (OpenCiv2
    //  `src/auto/window.cpp` `menu_revolution`, while `CIVF_GOV_CHANGED`, richardpenman/civ2@e39fe7b). It's the person's
    //  menu: computer players change government without it.
    new MayRechoose_1.default('civ2-government:player/may-rechoose', new Effect_1.default((player) => (0, isHuman_1.default)(player, clientRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=may-rechoose.js.map