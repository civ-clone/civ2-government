# civ2-government

Civilization II's seven governments, as rules on `base-government-change`. It mirrors `civ1-government` rule for rule,
under `civ2-government:` ids, with Civ2's numbers from OpenCiv2's reconstruction of the original
(richardpenman/civ2@49f26ec).

- **Governments:** Anarchy, Despotism, Monarchy, Communism, Fundamentalism, the Republic and Democracy, each from its
  own `base-government-*` package. Every player starts under Despotism.
- **Choosing:** Despotism always; each other government once its advance is known (`civ_can_choose_government`):
  Monarchy, Communism, Fundamentalism, The Republic, Democracy. Anarchy is never offered.
- **Revolution:** Anarchy lasts until the next turn that is a multiple of 4, 1 to 4 turns; after a Democracy falls to
  its cities' disorder, one such turn more (`civ_turn_update_diplomacy`). Then the player chooses. Revolutions are
  saved under `civ2-government:revolution`; the `civ2-government:player/revolution-terms` rule (`RevolutionTerms`)
  names that key and Anarchy, so code outside this package, such as a computer player, can start and finish them
  through `base-government-change`.
- **Choosing again:** in the turn a person chose a government, Revolution opens the choice again with no Anarchy
  (`menu_revolution`, `MayRechoose`). `lib/revolution`'s `chooseGovernment` records the choice with the game's rules.
  Computer players don't use the menu, so they can't.
- **The revolution offer** (`civ_advance_gov_prompts`): discovering a government's advance offers a revolution to it,
  Monarchy only from Despotism, any other government unless the player is under it already, under Democracy or in
  Anarchy, and nothing while a revolution is under way (`GovernmentAvailable`, and a research `Complete` rule through
  `base-government-change`'s `offerGovernments`). The engine emits `player:government:available` with the player and
  the government. A client that accepts calls `lib/revolution`'s
  `acceptRevolutionOffer(playerGovernment, pendingEffects, rules, turn)`, which always starts Anarchy, even in the
  turn a government was chosen: the original sets Anarchy directly, never through the menu's re-choice. (Plain
  `revolution` in that turn would skip Anarchy.) The original asks only a person; here every player's client is told,
  and decides.
- **A change of government** (`civ_set_government`), only when the government actually changes (the last one seen is
  kept for each player, and filled in at each turn's start for a player from a loaded game):
  - entering Anarchy, or any change by a computer player, ends every other player's vendetta against that player
    (civ2-diplomacy's `clearVendettasAgainst`);
  - a person's cities building Fanatics switch to Riflemen, shields kept, under any government but Fundamentalism,
    whether or not the city could choose Riflemen, as in the original. The change is measured from what the city had at
    the turn's start, as any change of production is, so changing back later in the turn gets that progress back.
- **Tables for the city rules** (they apply them with the `base-government-*` mechanisms):
  - `unitSupport`: `freeUnits(government, citySize)` (city size under Anarchy and Despotism; @COSMIC's 3, 3 and 8
    under Monarchy, Communism and Fundamentalism; none under the Republic and Democracy), `productionPerUnit` and
    `settlerFood` (1 up to Monarchy, 2 from Communism).
  - `martialLaw`: `martialLawTable` (1 a unit under Anarchy, Despotism and Monarchy, 2 under Communism, up to 3
    units) and `keepsMartialLaw`.
  - `militaryUnhappiness`: `militaryUnhappinessTable` (Republic 1, Democracy 2), `freeAggressiveUnits` (the
    Republic's first) and `policeStationExemption`.
  - The tile penalty and trade bonus are `civ2-world`'s (`lib/governmentTileYield`).

## Elsewhere

- The Statue of Liberty is civ2-wonder's; Fundamentalism's tithes, free buildings, contentment and Fanatics are in
  civ2-city-improvement, civ2-city-happiness, civ2-unit and civ2-city; its science limit and loss are civ2-science's.
- The maximum rates are civ2-trade-rate's, leader titles civ2-civilization's and the Senate civ2-diplomacy's.

## Not here yet

- The tutorial's Republic hint, which skips the offer of the Republic below Communism.

## Differences from the original

- Accepting a revolution offer in the turn you chose a government gives the full Anarchy; the original lets you choose
  again at once (its "chose this turn" flag survives the offer, so Revolution reopens the choice out of Anarchy).
