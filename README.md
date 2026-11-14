# civ2-government

Civilization II's seven governments, as rules on `base-government-change`. It mirrors `civ1-government` rule for rule,
under `civ2-government:` ids, with Civ2's numbers from OpenCiv2's reconstruction of the original
(richardpenman/civ2@49f26ec).

- **Governments:** Anarchy, Despotism, Monarchy, Communism, Fundamentalism, the Republic and Democracy, each from its
  own `base-government-*` package. Every player starts under Despotism.
- **Choosing:** Despotism always; each other government once its advance is known (`civ_can_choose_government`):
  Monarchy, Communism, Fundamentalism, The Republic, Democracy. Anarchy is never offered.
- **Revolution:** Anarchy lasts until the next turn that is a multiple of 4, 1 to 4 turns; after a Democracy falls to
  its cities' disorder, one such turn more (`civ_turn_update_diplomacy`). Then the player chooses.
- **Tables for the city rules** (they apply them with the `base-government-*` mechanisms):
  - `unitSupport`: `freeUnits(government, citySize)` (city size under Anarchy and Despotism; @COSMIC's 3, 3 and 8
    under Monarchy, Communism and Fundamentalism; none under the Republic and Democracy), `productionPerUnit` and
    `settlerFood` (1 up to Monarchy, 2 from Communism).
  - `martialLaw`: `martialLawTable` (1 a unit under Anarchy, Despotism and Monarchy, 2 under Communism, up to 3
    units) and `keepsMartialLaw`.
  - `militaryUnhappiness`: `militaryUnhappinessTable` (Republic 1, Democracy 2), `freeAggressiveUnits` (the
    Republic's first) and `policeStationExemption`.
  - The tile penalty and trade bonus are `civ2-world`'s (`lib/governmentTileYield`).

## Not here yet

- The Statue of Liberty (Anarchy ends next turn, any government), with the Wonders.
- Changing back without Anarchy in the turn a government was chosen, and the revolution offered on discovering a
  government's advance.
- Fundamentalism's own rules: no unhappy citizens, tithes, the science cap and loss, free Temples, Colosseums and
  Cathedrals, and Fanatics (free of support, built only under it).
- The probabilistic Senate, maximum rates, and leader titles by government.
