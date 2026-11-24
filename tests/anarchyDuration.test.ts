import anarchyDuration, {
  turnsToNextFourth,
} from '../Rules/Player/anarchy-duration';
import { Anarchy } from '../Governments';
import { expect } from 'chai';

// What leads to Anarchy and for how long, for the Civilopedia (civ-clone/web-renderer#621): every turn a revolution
//  can start on gives a wait within what the rules say.
describe('anarchy duration', (): void => {
  it('says a revolution leads to 1 to 4 turns of Anarchy, and a Democracy overthrown 5 to 8, as it waits', (): void => {
    let value = 0;

    const turn = { value: () => value } as never,
      [chosen, disorder] = anarchyDuration(turn),
      [said] = chosen.descriptions(),
      [saidDisorder] = disorder.descriptions();

    expect(said).to.eql({
      type: 'anarchy_follows',
      subject: Anarchy,
      cause: 'chosen',
      min: 1,
      max: 4,
    });
    expect(saidDisorder).to.eql({
      type: 'anarchy_follows',
      subject: Anarchy,
      cause: 'civil-disorder',
      min: 5,
      max: 8,
    });

    const waits = [0, 1, 2, 3, 4, 5, 6, 7].map((on: number) => {
      value = on;

      return [chosen.process(), disorder.process()];
    });

    expect(Math.min(...waits.map(([wait]) => wait))).to.equal(said.min);
    expect(Math.max(...waits.map(([wait]) => wait))).to.equal(said.max);
    expect(Math.min(...waits.map(([, wait]) => wait))).to.equal(
      saidDisorder.min
    );
    expect(Math.max(...waits.map(([, wait]) => wait))).to.equal(
      saidDisorder.max
    );
    expect(turnsToNextFourth(4)).to.equal(4);
  });
});
