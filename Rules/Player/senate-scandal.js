"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const revolution_1 = require("../../lib/revolution");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const SenateScandal_1 = require("@civ-clone/civ2-diplomacy/Rules/SenateScandal");
/**
 * A Senate's scandal brings the government down (OpenCiv2 `civ_change_government(civ, 0)` after a refused withdrawal,
 *  `diplomacy.cpp:6405`, and an espionage incident under a treaty, `:5318`). civ2-diplomacy decides whether there is
 *  one (`senateScandal`: Democracy always, a Republic one time in two); here the player falls into Anarchy, as a
 *  revolution of its own would (the original sets Anarchy without `CIVF_REVOLUTION`, so it lasts to the next turn that
 *  is a multiple of 4), even in a turn it chose a government. `civ2-government:senate-scandal` (player, other) is
 *  emitted for a notice.
 */
const getRules = (engine, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance, pendingEffects = core_pending_effect_1.instance, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance) => [
    new SenateScandal_1.default('civ2-government:player/senate-scandal/anarchy', new Effect_1.default((player, other) => {
        const playerGovernment = playerGovernmentRegistry.getByPlayer(player);
        if ((0, revolution_1.pendingRevolution)(playerGovernment, pendingEffects) !== null) {
            return;
        }
        (0, revolution_1.acceptRevolutionOffer)(playerGovernment, pendingEffects, ruleRegistry, turn);
        engine === null || engine === void 0 ? void 0 : engine.emit('civ2-government:senate-scandal', player, other);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=senate-scandal.js.map