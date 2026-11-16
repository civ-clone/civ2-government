import {
  PendingEffect,
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import {
  applyChosenGovernment,
  chooseGovernment as chooseGovernmentFor,
  pendingRevolution as pendingRevolutionFor,
  registerRevolutionHandler,
  revolution as revolutionFor,
  turnsUntilChoice as turnsUntilChoiceFor,
} from '@civ-clone/base-government-change/lib/revolution';
import { Anarchy } from '../Governments';
import Government from '@civ-clone/core-government/Government';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import { RevolutionCause } from '@civ-clone/base-government-change/Rules/AnarchyDuration';
import { rechoiceKey } from '@civ-clone/base-government-change/lib/rechoice';

// The revolution, on base-government-change, with this package's save key and Anarchy.

/**
 * Recorded in the save for a revolution whose new government has not been
 * chosen yet. The target is the `PlayerGovernment`, and `endTurn` is the turn
 * the choice becomes due.
 */
export const REVOLUTION = 'civ2-government:revolution';

export { RevolutionError } from '@civ-clone/base-government-change/lib/revolution';

export { applyChosenGovernment };

/** Registered with the rules, at import, so a revolution loaded from a save can still be finished. */
export const registerHandler = (
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): void => registerRevolutionHandler(REVOLUTION, pendingEffects);

export const pendingRevolution = (
  playerGovernment: PlayerGovernment,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): PendingEffect | null =>
  pendingRevolutionFor(REVOLUTION, playerGovernment, pendingEffects);

/** Turns until the new government can be chosen: `0` when it can be chosen now, `null` with no revolution under way. */
export const turnsUntilChoice = (
  playerGovernment: PlayerGovernment,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance,
  turn: Turn = turnInstance
): number | null =>
  turnsUntilChoiceFor(REVOLUTION, playerGovernment, pendingEffects, turn);

/**
 * Overthrow the current government. The player is in `Anarchy` for as many
 * turns as `AnarchyDuration` allows for the `cause`, then chooses a new
 * government through `ChooseGovernment`. With no Anarchy at all (a rule that
 * answers 0), the choice is due straight away and the current government stays
 * until it is made.
 */
export const revolution = (
  playerGovernment: PlayerGovernment,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  cause: RevolutionCause = 'chosen'
): void =>
  revolutionFor(
    REVOLUTION,
    Anarchy,
    playerGovernment,
    pendingEffects,
    ruleRegistry,
    turn,
    cause
  );

/**
 * Accept the offer of a revolution made on discovering a government's advance (`player:government:available`,
 * `Rules/Research/complete`). It always starts Anarchy, even in the turn a government was chosen: the original sets
 * Anarchy directly (OpenCiv2 `src/auto/civ.cpp` `civ_advance_gov_prompts`, richardpenman/civ2@e39fe7b), never through
 * the menu's re-choice. So the record of this turn's choice is dropped first, and the revolution is an ordinary one.
 */
export const acceptRevolutionOffer = (
  playerGovernment: PlayerGovernment,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance
): void => {
  pendingEffects
    .getByTarget(playerGovernment)
    .filter(
      (pendingEffect: PendingEffect): boolean =>
        pendingEffect.handler() === rechoiceKey(REVOLUTION)
    )
    .forEach((pendingEffect: PendingEffect): void =>
      pendingEffects.unregister(pendingEffect)
    );

  revolution(playerGovernment, pendingEffects, ruleRegistry, turn, 'chosen');
};

/**
 * Finish a revolution whose Anarchy is over, by choosing one of the available governments. The choice is recorded
 * with the game's rules (`ruleRegistry`), so a person who starts another revolution in the same turn chooses again with
 * no Anarchy (`Rules/Player/may-rechoose`).
 */
export const chooseGovernment = (
  playerGovernment: PlayerGovernment,
  GovernmentType: typeof Government,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance,
  turn: Turn = turnInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): void =>
  chooseGovernmentFor(
    REVOLUTION,
    playerGovernment,
    GovernmentType,
    pendingEffects,
    turn,
    ruleRegistry
  );
