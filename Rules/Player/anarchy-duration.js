"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.turnsToNextFourth = void 0;
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const AnarchyDuration_1 = require("@civ-clone/base-government-change/Rules/AnarchyDuration");
const Governments_1 = require("../../Governments");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const anarchyDuration_1 = require("@civ-clone/base-government-change/lib/anarchyDuration");
/**
 * The turns from `turn` to the next turn that is a multiple of 4, 1 to 4: Anarchy ends only at the start of such a turn
 * (OpenCiv2 `src/auto/civ.cpp` `civ_turn_update_diplomacy`, richardpenman/civ2@49f26ec, run as each civilization's turn
 * begins, after `game_advance_turn` has counted the turn). A revolution during a turn that is itself a multiple of 4
 * has missed that turn's check, so it waits 4.
 */
const turnsToNextFourth = (turn) => 4 - (turn % 4);
exports.turnsToNextFourth = turnsToNextFourth;
// What leads to Anarchy and for how long, for the Civilopedia (civ-clone/web-renderer#621): to the next turn that's a
//  multiple of 4, so 1 to 4 turns, and one such wait more after a Democracy's collapse.
const follows = (cause, min, max) => new Description_1.default({
    type: 'anarchy_follows',
    subject: Governments_1.Anarchy,
    cause,
    min,
    max,
});
const getRules = (turn = Turn_1.instance) => [
    new AnarchyDuration_1.default('civ2-government:player/anarchy-duration/default', new Criterion_1.default((0, anarchyDuration_1.forCause)('chosen')), new Effect_1.default(() => (0, exports.turnsToNextFourth)(turn.value())), follows('chosen', (0, exports.turnsToNextFourth)(3), (0, exports.turnsToNextFourth)(4))),
    // A Democracy brought down by its cities' disorder waits for one more such turn: the first only clears the flag the
    //  collapse set (`CIVF_REVOLUTION`), so 5 to 8 turns.
    new AnarchyDuration_1.default('civ2-government:player/anarchy-duration/civil-disorder', new Criterion_1.default((0, anarchyDuration_1.forCause)('civil-disorder')), new Effect_1.default(() => (0, exports.turnsToNextFourth)(turn.value()) + 4), follows('civil-disorder', (0, exports.turnsToNextFourth)(3) + 4, (0, exports.turnsToNextFourth)(4) + 4)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=anarchy-duration.js.map