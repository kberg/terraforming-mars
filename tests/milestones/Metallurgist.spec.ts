import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Metallurgist} from '../../src/server/milestones/Metallurgist';
import {TestPlayer} from '../TestPlayer';
import {Units} from '../../src/common/Units';

describe('Metallurgist', () => {
  let milestone: Metallurgist;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Metallurgist();
    [/* game */, player] = testGame(2);
  });

  const canClaimRuns = [
    {steel: 0, titanium: 0, expected: false},
    {steel: 5, titanium: 0, expected: false},
    {steel: 6, titanium: 0, expected: true},
    {steel: 0, titanium: 6, expected: true},
    {steel: 4, titanium: 2, expected: true},
    {steel: 4, titanium: 4, expected: true},
  ] as const;
  for (const run of canClaimRuns) {
    it('canClaim ' + JSON.stringify(run), () => {
      player.production.adjust(Units.of({steel: run.steel, titanium: run.titanium}));
      expect(milestone.canClaim(player)).eq(run.expected);
    });
  }
});
