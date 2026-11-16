"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Complete_1 = require("@civ-clone/core-science/Rules/Complete");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const revolution_1 = require("../../lib/revolution");
const Requirements_1 = require("../../Requirements");
const offer_1 = require("@civ-clone/base-government-change/lib/offer");
const getRules = (playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, pendingEffects = core_pending_effect_1.instance, ruleRegistry = RuleRegistry_1.instance, engine = Engine_1.instance) => [
    // An advance that opens a government offers a revolution to it, as `Rules/Governments/available` says
    //  (`civ_advance_gov_prompts`): the engine emits `player:government:available` with the player and the government.
    //  Nothing is offered while a revolution is under way. Accepting it is starting a revolution, so Anarchy.
    new Complete_1.default('civ2-government:research/complete/offer-revolution', new Effect_1.default((0, offer_1.default)(revolution_1.REVOLUTION, Requirements_1.default, playerGovernmentRegistry, pendingEffects, ruleRegistry, engine))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=complete.js.map