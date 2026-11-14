import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from '../Governments';
import { ChooseGovernment, Revolution } from '../PlayerActions';
import {
  chooseGovernment,
  revolution,
  turnsUntilChoice,
} from '../lib/revolution';
import { describe, it } from 'mocha';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import CommunismAdvance from '@civ-clone/base-science-advance-communism/Communism';
import DemocracyAdvance from '@civ-clone/base-science-advance-democracy/Democracy';
import FundamentalismAdvance from '@civ-clone/base-science-advance-fundamentalism/Fundamentalism';
import { Game } from '@civ-clone/core-game';
import MonarchyAdvance from '@civ-clone/base-science-advance-monarchy/Monarchy';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import TheRepublic from '@civ-clone/base-science-advance-therepublic/TheRepublic';
import { expect } from 'chai';
import register from '../registerRules';
import { turnsToNextFourth } from '../Rules/Player/anarchy-duration';

const governments = [
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
];

// A game with this package's rules, as `register(game)` gives them.
const setUp = () => {
  const game = new Game();

  game.availableGovernments.register(...governments);

  register(game);

  const player = new Player(game.rules),
    research = new PlayerResearch(player, new AdvanceRegistry(), game.rules);

  game.playerResearch.register(research);

  const playerGovernment = game.playerGovernments.getByPlayer(player);

  return { game, player, playerGovernment, research };
};

describe('governments', (): void => {
  it('starts every player under Despotism', (): void => {
    const { playerGovernment } = setUp();

    expect(playerGovernment.is(Despotism)).true;
  });

  it('offers only Despotism until an advance opens another, and never Anarchy', (): void => {
    const { playerGovernment } = setUp();

    expect(playerGovernment.available()).eql([Despotism]);
  });

  (
    [
      [Monarchy, MonarchyAdvance],
      [Communism, CommunismAdvance],
      [Fundamentalism, FundamentalismAdvance],
      [Republic, TheRepublic],
      [Democracy, DemocracyAdvance],
    ] as [typeof Despotism, typeof Advance][]
  ).forEach(([Government, NeededAdvance]): void => {
    it(`offers ${Government.name} with ${NeededAdvance.name}`, (): void => {
      const { playerGovernment, research } = setUp();

      research.addAdvance(NeededAdvance);

      expect(playerGovernment.available()).members([Despotism, Government]);
    });
  });

  it('keeps Fundamentalism the government and the advance apart', (): void => {
    expect(Fundamentalism).not.equal(FundamentalismAdvance);
    expect((FundamentalismAdvance as any).type).equal('FundamentalismAdvance');
  });
});

describe('revolution', (): void => {
  it('lasts until the next turn that is a multiple of 4', (): void => {
    expect([1, 2, 3, 4, 5, 6, 7, 8].map(turnsToNextFourth)).eql([
      3, 2, 1, 4, 3, 2, 1, 4,
    ]);
  });

  it('puts the player in Anarchy, then offers the choice on that turn', (): void => {
    const { game, player, playerGovernment, research } = setUp();

    research.addAdvance(MonarchyAdvance);
    [1, 2, 3, 4, 5].forEach(() => game.turn.increment());

    expect(player.actions().some((action) => action instanceof Revolution))
      .true;

    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);

    expect(playerGovernment.is(Anarchy)).true;
    expect(
      turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn)
    ).equal(3);
    expect(player.actions().some((action) => action instanceof Revolution))
      .false;

    [6, 7, 8].forEach(() => game.turn.increment());

    expect(
      player.actions().some((action) => action instanceof ChooseGovernment)
    ).true;

    chooseGovernment(
      playerGovernment,
      Monarchy,
      game.pendingEffects,
      game.turn
    );

    expect(playerGovernment.is(Monarchy)).true;
  });

  it("waits one more such turn after a Democracy falls to its cities' disorder", (): void => {
    const { game, playerGovernment } = setUp();

    [1, 2, 3, 4, 5, 6].forEach(() => game.turn.increment());

    revolution(
      playerGovernment,
      game.pendingEffects,
      game.rules,
      game.turn,
      'civil-disorder'
    );

    expect(
      turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn)
    ).equal(6);
  });
});
