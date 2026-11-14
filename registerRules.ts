import action from './Rules/Player/action';
import added from './Rules/Player/added';
import anarchyDuration from './Rules/Player/anarchy-duration';
import availability from './Requirements';
import { deriveAvailabilityRules } from './Rules/Governments/availability';
import governmentChanged from './Rules/Player/government-changed';
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void => {
  game.rules.register(
    ...action(game.playerGovernments, game.pendingEffects, game.turn),
    ...added(game.availableGovernments, game.playerGovernments, game.rules),
    ...anarchyDuration(game.turn)
  );

  // Which governments a player may choose, from the entries in `Requirements`, so a plugin can change an entry and its
  //  rule together.
  game.requirements.add(
    deriveAvailabilityRules(game.playerResearch),
    ...availability
  );

  game.rules.register(...governmentChanged(game.engine, game.playerWorlds));
};

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
