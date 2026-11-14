import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import AnarchyDuration from '@civ-clone/base-government-change/Rules/AnarchyDuration';
/**
 * The turns from `turn` to the next turn that is a multiple of 4, 1 to 4: Anarchy ends only at the start of such a turn
 * (OpenCiv2 `src/auto/civ.cpp` `civ_turn_update_diplomacy`, richardpenman/civ2@49f26ec, run as each civilization's turn
 * begins, after `game_advance_turn` has counted the turn). A revolution during a turn that is itself a multiple of 4
 * has missed that turn's check, so it waits 4.
 */
export declare const turnsToNextFourth: (turn: number) => number;
export declare const getRules: (turn?: Turn) => AnarchyDuration[];
export default getRules;
