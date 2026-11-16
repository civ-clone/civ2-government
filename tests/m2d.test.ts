import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
} from '../Governments';
import {
  acceptRevolutionOffer,
  chooseGovernment,
  revolution,
  turnsUntilChoice,
} from '../lib/revolution';
import { describe, it } from 'mocha';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Build from '@civ-clone/core-city-build/Rules/Build';
import { IBuildable as Buildable } from '@civ-clone/core-city-build/Buildable';
import { buildCosts } from '@civ-clone/core-city-build/Rules/BuildCost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import ProductionChanged from '@civ-clone/core-city-build/Rules/ProductionChanged';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Yield from '@civ-clone/core-yield/Yield';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import CommunismAdvance from '@civ-clone/base-science-advance-communism/Communism';
import DemocracyAdvance from '@civ-clone/base-science-advance-democracy/Democracy';
import Engine from '@civ-clone/core-engine/Engine';
import Fanatic from '@civ-clone/base-unit-fanatic/Fanatic';
import FundamentalismAdvance from '@civ-clone/base-science-advance-fundamentalism/Fundamentalism';
import { Game } from '@civ-clone/core-game';
import Government from '@civ-clone/core-government/Government';
import InteractionRegistry from '@civ-clone/core-diplomacy/InteractionRegistry';
import MonarchyAdvance from '@civ-clone/base-science-advance-monarchy/Monarchy';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Rifleman from '@civ-clone/base-unit-rifleman/Rifleman';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TheRepublic from '@civ-clone/base-science-advance-therepublic/TheRepublic';
import Vendetta from '@civ-clone/library-diplomacy/Declarations/Vendetta';
import { expect } from 'chai';
import governmentChanged from '../Rules/Player/government-changed';
import register from '../registerRules';

const governments = [
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Fundamentalism,
  Monarchy,
  Republic,
];

type Kind = 'person' | 'computer';

const setUp = (kind: Kind = 'person') => {
  const game = new Game();

  game.availableGovernments.register(...governments);

  register(game);

  const player = new Player(game.rules),
    research = new PlayerResearch(player, new AdvanceRegistry(), game.rules);

  game.clients.register(
    kind === 'person' ? new Client(player) : new AIClient(player)
  );
  game.playerResearch.register(research);

  const playerGovernment = game.playerGovernments.getByPlayer(player),
    offers: string[] = [];

  game.engine.on(
    'player:government:available',
    (offeredTo: Player, GovernmentType: typeof Government): void => {
      if (offeredTo === player) {
        offers.push(GovernmentType.name);
      }
    }
  );

  return { game, offers, player, playerGovernment, research };
};

// Through a revolution to `GovernmentType`, as a player who has every advance it needs (turn 4 ends Anarchy).
const governedBy = (
  { game, playerGovernment, research }: ReturnType<typeof setUp>,
  GovernmentType: typeof Government
): void => {
  if (GovernmentType === Despotism) {
    return;
  }

  if (GovernmentType === Anarchy) {
    playerGovernment.set(new Anarchy());

    return;
  }

  (
    [
      [Monarchy, MonarchyAdvance],
      [Communism, CommunismAdvance],
      [Fundamentalism, FundamentalismAdvance],
      [Republic, TheRepublic],
      [Democracy, DemocracyAdvance],
    ] as [typeof Government, typeof Advance][]
  )
    .filter(([Type]) => Type === GovernmentType)
    .forEach(([, NeededAdvance]) => research.addAdvance(NeededAdvance));

  revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);
  while (
    turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn) !== 0
  ) {
    game.turn.increment();
  }
  chooseGovernment(
    playerGovernment,
    GovernmentType,
    game.pendingEffects,
    game.turn,
    game.rules
  );
  game.turn.increment();
};

describe('choosing again in the same turn', (): void => {
  it('lets a person who chose a government this turn choose again, with no Anarchy', (): void => {
    const setup = setUp('person'),
      { game, playerGovernment, research } = setup;

    research.addAdvance(MonarchyAdvance);
    research.addAdvance(TheRepublic);
    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);
    while (
      turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn) !== 0
    ) {
      game.turn.increment();
    }

    chooseGovernment(
      playerGovernment,
      Monarchy,
      game.pendingEffects,
      game.turn,
      game.rules
    );

    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);

    expect(playerGovernment.is(Monarchy)).true;
    expect(
      turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn)
    ).equal(0);

    chooseGovernment(
      playerGovernment,
      Republic,
      game.pendingEffects,
      game.turn,
      game.rules
    );

    expect(playerGovernment.is(Republic)).true;
  });

  it('puts a person in Anarchy for a revolution on a later turn', (): void => {
    const setup = setUp('person'),
      { game, playerGovernment } = setup;

    governedBy(setup, Monarchy);

    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);

    expect(playerGovernment.is(Anarchy)).true;
  });

  it("doesn't let a computer player choose again without Anarchy", (): void => {
    const setup = setUp('computer'),
      { game, playerGovernment, research } = setup;

    research.addAdvance(MonarchyAdvance);
    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);
    while (
      turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn) !== 0
    ) {
      game.turn.increment();
    }
    chooseGovernment(
      playerGovernment,
      Monarchy,
      game.pendingEffects,
      game.turn,
      game.rules
    );

    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);

    expect(playerGovernment.is(Anarchy)).true;
  });
});

describe('the revolution offer', (): void => {
  // The government the player is under, the advance discovered, and the government offered (null for none).
  (
    [
      [Despotism, MonarchyAdvance, 'Monarchy'],
      [Communism, MonarchyAdvance, null],
      [Despotism, TheRepublic, 'Republic'],
      [Monarchy, TheRepublic, 'Republic'],
      [Communism, TheRepublic, 'Republic'],
      [Republic, CommunismAdvance, 'Communism'],
      [Despotism, FundamentalismAdvance, 'Fundamentalism'],
      [Monarchy, DemocracyAdvance, 'Democracy'],
      [Democracy, CommunismAdvance, null],
      [Anarchy, TheRepublic, null],
    ] as [typeof Government, typeof Advance, string | null][]
  ).forEach(([GovernmentType, Discovered, offered]) =>
    it(`${offered === null ? 'offers nothing' : `offers ${offered}`} under ${
      GovernmentType.name
    } on discovering ${Discovered.name}`, (): void => {
      const setup = setUp();

      governedBy(setup, GovernmentType);

      setup.offers.splice(0);
      setup.research.addAdvance(Discovered);

      expect(setup.offers).eql(offered === null ? [] : [offered]);
    })
  );

  it('offers nothing while a revolution is under way', (): void => {
    const setup = setUp(),
      { game, offers, playerGovernment, research } = setup;

    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);
    research.addAdvance(MonarchyAdvance);

    expect(offers).eql([]);
  });

  it('starts Anarchy when the offer is accepted, even in the turn a government was chosen', (): void => {
    const setup = setUp('person'),
      { game, offers, playerGovernment, research } = setup;

    research.addAdvance(MonarchyAdvance);
    revolution(playerGovernment, game.pendingEffects, game.rules, game.turn);
    while (
      turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn) !== 0
    ) {
      game.turn.increment();
    }
    chooseGovernment(
      playerGovernment,
      Monarchy,
      game.pendingEffects,
      game.turn,
      game.rules
    );

    // In the same turn: the Republic's advance, and its offer, accepted.
    offers.splice(0);
    research.addAdvance(TheRepublic);
    expect(offers).eql(['Republic']);

    acceptRevolutionOffer(
      playerGovernment,
      game.pendingEffects,
      game.rules,
      game.turn
    );

    expect(playerGovernment.is(Anarchy)).true;
    expect(
      turnsUntilChoice(playerGovernment, game.pendingEffects, game.turn)
    ).to.be.greaterThan(0);
  });

  it('offers computer players too, for their client to decide', (): void => {
    const { offers, research } = setUp('computer');

    research.addAdvance(MonarchyAdvance);

    expect(offers).eql(['Monarchy']);
  });
});

describe('a change of government', (): void => {
  const changeSetUp = (kind: Kind) => {
    const ruleRegistry = new RuleRegistry(),
      interactionRegistry = new InteractionRegistry(),
      clientRegistry = new ClientRegistry(),
      cities: City[] = [],
      cityBuilds: CityBuild[] = [],
      // Stand-ins: the real registries take only real cities and builds.
      cityRegistry = {
        getByPlayer: (owner: Player): City[] =>
          cities.filter((city: City): boolean => city.player() === owner),
      } as unknown as CityRegistry,
      cityBuildRegistry = {
        getBy: (key: string, city: City): CityBuild[] =>
          cityBuilds.filter(
            (cityBuild: CityBuild): boolean => cityBuild.city() === city
          ),
      } as unknown as CityBuildRegistry,
      player = new Player(ruleRegistry),
      other = new Player(ruleRegistry),
      third = new Player(ruleRegistry);

    ruleRegistry.register(
      ...governmentChanged(
        new Engine(),
        new PlayerWorldRegistry(),
        interactionRegistry,
        clientRegistry,
        cityRegistry,
        cityBuildRegistry
      )
    );
    clientRegistry.register(
      kind === 'person' ? new Client(player) : new AIClient(player)
    );

    const theirs = new Vendetta(other, player, ruleRegistry),
      thirds = new Vendetta(third, player, ruleRegistry),
      ours = new Vendetta(player, other, ruleRegistry);

    interactionRegistry.register(theirs, thirds, ours);

    return {
      cities,
      cityBuilds,
      interactionRegistry,
      ours,
      ruleRegistry,
      player,
      playerGovernment: new PlayerGovernment(player, undefined, ruleRegistry),
      theirs,
      thirds,
    };
  };

  it("ends every other player's vendetta against a person entering Anarchy, and leaves theirs", (): void => {
    const { ours, playerGovernment, theirs, thirds } = changeSetUp('person');

    playerGovernment.set(new Anarchy());

    expect(theirs.active()).false;
    expect(thirds.active()).false;
    expect(ours.active()).true;
  });

  it('leaves vendettas against a person choosing any other government', (): void => {
    const { playerGovernment, theirs } = changeSetUp('person');

    playerGovernment.set(new Monarchy());

    expect(theirs.active()).true;
  });

  it('ends vendettas against a computer player at any change of government', (): void => {
    const { ours, playerGovernment, theirs } = changeSetUp('computer');

    playerGovernment.set(new Monarchy());

    expect(theirs.active()).false;
    expect(ours.active()).true;
  });

  const withBuilds = (
    kind: Kind,
    building: unknown,
    riflemenAvailable: boolean
  ) => {
    const setup = changeSetUp(kind),
      built: unknown[] = [],
      city = { player: () => setup.player } as unknown as City,
      cityBuild = {
        city: () => city,
        building: () =>
          building === null ? null : { item: (): unknown => building },
        getAvailable: (Item: unknown) =>
          Item === Rifleman && riflemenAvailable ? {} : undefined,
        build: (Item: unknown): void => {
          built.push(Item);
        },
      };

    setup.cities.push(city);
    setup.cityBuilds.push(cityBuild as unknown as CityBuild);

    return { ...setup, built };
  };

  it("switches a person's Fanatics in production to Riflemen when leaving Fundamentalism", (): void => {
    const { built, playerGovernment } = withBuilds('person', Fanatic, true);

    playerGovernment.set(new Anarchy());

    expect(built).eql([Rifleman]);
  });

  it('leaves Fanatics under Fundamentalism, and other production', (): void => {
    expect(
      (() => {
        const { built, playerGovernment } = withBuilds('person', Fanatic, true);

        playerGovernment.set(new Fundamentalism());

        return built;
      })()
    ).eql([]);

    expect(
      (() => {
        const { built, playerGovernment } = withBuilds(
          'person',
          Rifleman,
          true
        );

        playerGovernment.set(new Anarchy());

        return built;
      })()
    ).eql([]);
  });

  it('acts only on an actual change of government', (): void => {
    const { built, playerGovernment, theirs } = withBuilds(
      'computer',
      Fanatic,
      true
    );

    playerGovernment.set(new Monarchy());
    expect(theirs.active()).false;

    const { built: personBuilt, playerGovernment: personGovernment } =
      withBuilds('person', Fanatic, true);

    personGovernment.set(new Monarchy());
    expect(personBuilt).eql([Rifleman]);

    // The same government again: no vendetta ends, no production changes.
    personBuilt.splice(0);
    personGovernment.set(new Monarchy());
    expect(personBuilt).eql([]);

    const computer = withBuilds('computer', Fanatic, true);

    computer.playerGovernment.set(new Monarchy());
    expect(computer.theirs.active()).false;

    computer.thirds.expire();
    const again = new Vendetta(
      computer.thirds.players()[0],
      computer.player,
      computer.ruleRegistry
    );

    computer.interactionRegistry.register(again);
    computer.playerGovernment.set(new Monarchy());
    expect(again.active()).true;

    computer.playerGovernment.set(new Republic());
    expect(again.active()).false;
    expect(built).eql([]);
  });

  it("leaves a computer player's Fanatics, as the original does", (): void => {
    const { built, playerGovernment } = withBuilds('computer', Fanatic, true);

    playerGovernment.set(new Anarchy());

    expect(built).eql([]);
  });
});

describe('a change of government, with a real build and after a load', (): void => {
  class Temple {
    static build(): null {
      return null;
    }
  }

  const setUp = (riflemenAvailable: boolean) => {
    const ruleRegistry = new RuleRegistry(),
      clientRegistry = new ClientRegistry(),
      interactionRegistry = new InteractionRegistry(),
      playerGovernmentRegistry = new PlayerGovernmentRegistry(),
      availableItems = new AvailableCityBuildItemsRegistry(),
      player = new Player(ruleRegistry),
      city = { player: () => player } as unknown as City,
      cityBuild = new CityBuild(city, availableItems, ruleRegistry),
      category = (Item: unknown): string =>
        Item === Temple ? 'improvement' : 'unit';

    availableItems.register(
      Temple as unknown as Buildable,
      Fanatic as unknown as Buildable,
      Rifleman as unknown as Buildable
    );
    clientRegistry.register(new Client(player));

    ruleRegistry.register(
      ...buildCosts([
        [Temple as unknown as Buildable, 30],
        [Fanatic as unknown as Buildable, 20],
        [Rifleman as unknown as Buildable, 20],
      ]),
      new Build(
        new Criterion((city: City, Item: unknown) => Item === Rifleman),
        new Effect(() => new Criterion(() => riflemenAvailable))
      ),
      // A stand-in for civ2-city's change penalty: half the progress for a change between an improvement and a unit,
      //  none for a change within one category.
      new ProductionChanged(
        new Effect(
          (
            build: CityBuild,
            from: unknown,
            to: unknown,
            progress: number
          ): number =>
            category(from) === category(to)
              ? progress
              : Math.floor(progress / 2)
        )
      )
    );

    const playerGovernment = new PlayerGovernment(
      player,
      undefined,
      ruleRegistry
    );

    playerGovernmentRegistry.register(playerGovernment);

    const register = (): void =>
      ruleRegistry.register(
        ...governmentChanged(
          new Engine(),
          new PlayerWorldRegistry(),
          interactionRegistry,
          clientRegistry,
          {
            getByPlayer: (owner: Player): City[] =>
              owner === player ? [city] : [],
          } as unknown as CityRegistry,
          {
            getBy: (key: string, of: City): CityBuild[] =>
              of === city ? [cityBuild] : [],
          } as unknown as CityBuildRegistry,
          playerGovernmentRegistry
        )
      );

    return {
      cityBuild,
      clientRegistry,
      interactionRegistry,
      player,
      playerGovernment,
      register,
      ruleRegistry,
    };
  };

  [true, false].forEach((riflemenAvailable: boolean): void =>
    it(`switches to Riflemen keeping the turn's starting point, so a change back is refunded (Riflemen ${
      riflemenAvailable ? '' : 'not '
    }available)`, (): void => {
      const { cityBuild, playerGovernment, register } =
        setUp(riflemenAvailable);

      register();
      playerGovernment.set(new Fundamentalism());

      // The turn starts with 20 towards a Temple; changing to Fanatics costs half.
      cityBuild.build(Temple as unknown as Buildable);
      cityBuild.add(new Yield(20));
      cityBuild.build(Fanatic as unknown as Buildable);
      expect(cityBuild.progress().value()).equal(10);

      (cityBuild as unknown as { _queueDropped: unknown[] })._queueDropped = [
        Temple,
      ];

      playerGovernment.set(new Anarchy());

      expect(cityBuild.building()?.item()).equal(Rifleman);
      expect(cityBuild.cost().value()).equal(20);
      expect(cityBuild.progress().value()).equal(10);
      expect(cityBuild.queueDropped()).eql([]);

      // Back to the Temple the turn started with: the 20 it had then.
      cityBuild.build(Temple as unknown as Buildable);
      expect(cityBuild.progress().value()).equal(20);
    })
  );

  it("counts setting a loaded player's government again as no change, once its turn has started", (): void => {
    const loaded = setUp(true),
      control = setUp(true);

    [loaded, control].forEach((setup) => {
      // The government a save restored: set before this game's rules are registered.
      setup.playerGovernment.set(new Monarchy());
      setup.clientRegistry.unregister(
        ...setup.clientRegistry.getBy('player', setup.player)
      );
      setup.clientRegistry.register(new AIClient(setup.player));
      setup.register();
    });

    const other = new Player(loaded.ruleRegistry),
      vendetta = new Vendetta(other, loaded.player, loaded.ruleRegistry),
      controlVendetta = new Vendetta(
        new Player(control.ruleRegistry),
        control.player,
        control.ruleRegistry
      );

    loaded.interactionRegistry.register(vendetta);
    control.interactionRegistry.register(controlVendetta);

    loaded.ruleRegistry.process(TurnStart, loaded.player);

    loaded.playerGovernment.set(new Monarchy());
    control.playerGovernment.set(new Monarchy());

    expect(vendetta.active()).true;
    // Without a turn start to see the loaded government, the same government counts as a change.
    expect(controlVendetta.active()).false;

    loaded.playerGovernment.set(new Republic());
    expect(vendetta.active()).false;
  });
});
