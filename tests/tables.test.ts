import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from '../Governments';
import { freeUnits, productionPerUnit, settlerFood } from '../unitSupport';
import {
  freeAggressiveUnits,
  militaryUnhappinessTable,
} from '../militaryUnhappiness';
import {
  martialLawLevel,
  martialLaw,
} from '@civ-clone/base-government-martial-law/lib/martialLaw';
import { describe, it } from 'mocha';
import City from '@civ-clone/core-city/City';
import Government from '@civ-clone/core-government/Government';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import { expect } from 'chai';
import { martialLawTable } from '../martialLaw';
import { militaryUnhappinessPerUnit } from '@civ-clone/base-government-military-unhappiness/lib/militaryUnhappiness';

const all: (typeof Government)[] = [
  Anarchy,
  Despotism,
  Monarchy,
  Communism,
  Fundamentalism,
  Republic,
  Democracy,
];

const under = (Type: typeof Government): PlayerGovernment => {
  const playerGovernment = new PlayerGovernment(
    new Player(new RuleRegistry()),
    undefined,
    new RuleRegistry()
  );

  playerGovernment.set(new Type());

  return playerGovernment;
};

describe('unit support', (): void => {
  it('frees as many units as the city is big under Anarchy and Despotism, 3, 3 and 8 next, then none', (): void => {
    expect(all.map((Type) => freeUnits(under(Type), 5))).eql([
      5, 5, 3, 3, 8, 0, 0,
    ]);
    expect(freeUnits(under(Despotism), 2)).equal(2);
    expect(productionPerUnit).equal(1);
  });

  it('feeds settlers 1 food up to Monarchy and 2 from Communism on', (): void => {
    expect(all.map((Type) => settlerFood(under(Type)))).eql([
      1, 1, 1, 2, 2, 2, 2,
    ]);
  });
});

describe('martial law', (): void => {
  it('makes 1 content per unit under Anarchy, Despotism and Monarchy, 2 under Communism, up to 3 units', (): void => {
    expect(
      all.map((Type) => martialLawLevel(martialLawTable, under(Type)))
    ).eql([
      { maximumUnits: 3, perUnit: 1 },
      { maximumUnits: 3, perUnit: 1 },
      { maximumUnits: 3, perUnit: 1 },
      { maximumUnits: 3, perUnit: 2 },
      null,
      null,
      null,
    ]);
  });

  // Martial law is negative unhappiness: 2 a unit, 3 units, so 6 of 8.
  it('calms at most 6 under Communism', (): void => {
    const player = new Player(new RuleRegistry()),
      tile = {},
      city = { tile: () => tile, player: () => player } as unknown as City,
      unitRegistry = new UnitRegistry(),
      unit = {
        player: () => player,
        tile: () => tile,
        attack: () => ({ value: () => 1 }),
        id: () => 'unit',
      } as unknown as Unit;

    unitRegistry.getByTile = () => [unit, unit, unit, unit];

    const level = martialLawLevel(martialLawTable, under(Communism))!,
      calmed = martialLaw(city, 8, level, undefined, unitRegistry)
        .map((yieldValue) => -yieldValue.value())
        .reduce((total, value) => total + value, 0);

    expect(calmed).equal(6);
  });
});

describe('military unhappiness', (): void => {
  it('makes 1 unhappy per aggressive unit under the Republic and 2 under Democracy', (): void => {
    expect(
      all.map((Type) =>
        militaryUnhappinessPerUnit(militaryUnhappinessTable, under(Type))
      )
    ).eql([0, 0, 0, 0, 0, 1, 2]);
  });

  it("spares the Republic's first aggressive unit", (): void => {
    expect(all.map((Type) => freeAggressiveUnits(under(Type)))).eql([
      0, 0, 0, 0, 0, 1, 0,
    ]);
  });
});
