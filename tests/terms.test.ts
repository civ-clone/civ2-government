import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from '../Governments';
import { describe, it } from 'mocha';
import { Game } from '@civ-clone/core-game';
import Government from '@civ-clone/core-government/Government';
import { expect } from 'chai';
import { governmentTerms } from '@civ-clone/base-government-terms/lib/terms';
import register from '../registerRules';

describe('government terms', (): void => {
  const game = new Game();

  register(game);

  const termsOf = (GovernmentType: typeof Government) =>
    governmentTerms(game.rules, GovernmentType)!;

  it('frees as many units as the size under Anarchy and Despotism, then 3, 3, 8, 0 and 0', (): void => {
    expect(termsOf(Anarchy).freeUnits!(5)).equal(5);
    expect(termsOf(Despotism).freeUnits!(2)).equal(2);
    expect(
      [Monarchy, Communism, Fundamentalism, Republic, Democracy].map(
        (GovernmentType) => termsOf(GovernmentType).freeUnits!(12)
      )
    ).eql([3, 3, 8, 0, 0]);
    expect(termsOf(Monarchy).unitSupportCost).equal(1);
  });

  it('keeps martial law with up to 3 units, 1 citizen each up to Monarchy and 2 under Communism, none after', (): void => {
    expect(termsOf(Monarchy).martialLaw).eql({ maximumUnits: 3, perUnit: 1 });
    expect(termsOf(Communism).martialLaw).eql({ maximumUnits: 3, perUnit: 2 });
    expect(termsOf(Fundamentalism).martialLaw!.maximumUnits).equal(0);
    expect(termsOf(Democracy).martialLaw!.maximumUnits).equal(0);
  });

  it('makes 1 citizen unhappy per aggressive unit past the first under the Republic, 2 under Democracy', (): void => {
    expect(termsOf(Republic).militaryUnhappiness).eql({ perUnit: 1, free: 1 });
    expect(termsOf(Democracy).militaryUnhappiness).eql({
      perUnit: 2,
      free: 0,
    });
    expect(termsOf(Monarchy).militaryUnhappiness).eql({ perUnit: 0, free: 0 });
  });

  it('has no unhappy citizens under Fundamentalism, and half the science', (): void => {
    expect(termsOf(Fundamentalism).noUnhappiness).true;
    expect(termsOf(Fundamentalism).science).equal(0.5);
    expect(termsOf(Republic).noUnhappiness).false;
    expect(termsOf(Republic).science).equal(1);
  });

  it("answers nothing for a government that isn't Civ2's", (): void => {
    class Other extends Government {}

    expect(governmentTerms(game.rules, Other)).null;
  });
});
