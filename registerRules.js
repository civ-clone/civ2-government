"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const action_1 = require("./Rules/Player/action");
const added_1 = require("./Rules/Player/added");
const anarchy_duration_1 = require("./Rules/Player/anarchy-duration");
const Requirements_1 = require("./Requirements");
const availability_1 = require("./Rules/Governments/availability");
const available_1 = require("./Rules/Governments/available");
const government_changed_1 = require("./Rules/Player/government-changed");
const terms_1 = require("./Rules/Government/terms");
const may_rechoose_1 = require("./Rules/Player/may-rechoose");
const complete_1 = require("./Rules/Research/complete");
const revolution_terms_1 = require("./Rules/Player/revolution-terms");
const senate_scandal_1 = require("./Rules/Player/senate-scandal");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => {
    game.rules.register(...(0, action_1.default)(game.playerGovernments, game.pendingEffects, game.turn), ...(0, added_1.default)(game.availableGovernments, game.playerGovernments, game.rules), ...(0, anarchy_duration_1.default)(game.turn));
    // Which governments a player may choose, from the entries in `Requirements`, so a plugin can change an entry and its
    //  rule together.
    game.requirements.add((0, availability_1.deriveAvailabilityRules)(game.playerResearch), ...Requirements_1.default);
    game.rules.register(...(0, government_changed_1.default)(game.engine, game.playerWorlds, game.interactions, game.clients, game.cities, game.cityBuilds, game.playerGovernments), ...(0, may_rechoose_1.default)(game.clients), ...(0, senate_scandal_1.default)(game.engine, game.playerGovernments, game.pendingEffects, game.rules, game.turn), ...(0, available_1.default)(game.playerGovernments), ...(0, terms_1.default)(), ...(0, complete_1.default)(game.playerGovernments, game.pendingEffects, game.rules, game.engine));
    // Last, so no other rule moves in the order rules run.
    game.rules.register(...(0, revolution_terms_1.default)());
};
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map