import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import AnarchyDuration from '@civ-clone/base-government-change/Rules/AnarchyDuration';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { forCause } from '@civ-clone/base-government-change/lib/anarchyDuration';

/**
 * The turns from `turn` to the next turn that is a multiple of 4, 1 to 4: Anarchy ends only at the start of such a turn
 * (OpenCiv2 `src/auto/civ.cpp` `civ_turn_update_diplomacy`, richardpenman/civ2@49f26ec, run as each civilization's turn
 * begins, after `game_advance_turn` has counted the turn). A revolution during a turn that is itself a multiple of 4
 * has missed that turn's check, so it waits 4.
 */
export const turnsToNextFourth = (turn: number): number => 4 - (turn % 4);

export const getRules: (turn?: Turn) => AnarchyDuration[] = (
  turn: Turn = turnInstance
): AnarchyDuration[] => [
  new AnarchyDuration(
    'civ2-government:player/anarchy-duration/default',
    new Criterion(forCause('chosen')),
    new Effect((): number => turnsToNextFourth(turn.value()))
  ),
  // A Democracy brought down by its cities' disorder waits for one more such turn: the first only clears the flag the
  //  collapse set (`CIVF_REVOLUTION`), so 5 to 8 turns.
  new AnarchyDuration(
    'civ2-government:player/anarchy-duration/civil-disorder',
    new Criterion(forCause('civil-disorder')),
    new Effect((): number => turnsToNextFourth(turn.value()) + 4)
  ),
];

export default getRules;
