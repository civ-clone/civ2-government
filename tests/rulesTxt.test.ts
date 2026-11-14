import {
  readCosmic,
  readGovernments,
} from '@civ-clone/civ2-asset-extractor/rules';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { freeUnits, settlerFood } from '../unitSupport';
import Government from '@civ-clone/core-government/Government';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import { Communism, Fundamentalism, Monarchy, Republic } from '../Governments';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { readFileSync } from 'fs';
import { join } from 'path';

// Compares the numbers the tables take from @COSMIC with the player's own RULES.TXT, as the game clamps them. Skipped
//  unless `CIV2_PATH` names the game's folder, so CI, which has no copy of the game, never runs it.
const path = process.env.CIV2_PATH;

const under = (Type: typeof Government): PlayerGovernment => {
  const playerGovernment = new PlayerGovernment(
    new Player(new RuleRegistry()),
    undefined,
    new RuleRegistry()
  );

  playerGovernment.set(new Type());

  return playerGovernment;
};

(path ? describe : describe.skip)('RULES.TXT', (): void => {
  const rules = path ? readFileSync(join(path, 'RULES.TXT'), 'latin1') : '';

  it('@GOVERNMENTS: 7 rows, one per government', (): void => {
    expect(readGovernments(rules).length === 7).true;
  });

  it('@COSMIC: the free units and settler food', (): void => {
    const { effective } = readCosmic(rules);

    expect(freeUnits(under(Monarchy), 1) === effective.monarchyFreeSupport)
      .true;
    expect(freeUnits(under(Communism), 1) === effective.communismFreeSupport)
      .true;
    expect(
      freeUnits(under(Fundamentalism), 1) ===
        effective.fundamentalismFreeSupport
    ).true;
    expect(settlerFood(under(Monarchy)) === effective.settlerFoodLow).true;
    expect(settlerFood(under(Republic)) === effective.settlerFoodHigh).true;
  });
});
