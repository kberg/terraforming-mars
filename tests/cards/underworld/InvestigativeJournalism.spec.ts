import {expect} from 'chai';
import {InvestigativeJournalism} from '../../../src/server/cards/underworld/InvestigativeJournalism';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';

describe('InvestigativeJournalism', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: InvestigativeJournalism;

  beforeEach(() => {
    card = new InvestigativeJournalism();
    [game, player, player2, player3] = testGame(3, {underworldExpansion: true});
  });

  it('canPlay', () => {
    player.production.override({megacredits: -4});
    expect(card.canPlay(player)).is.false;
    player.production.override({megacredits: -3});
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.megacredits).eq(-2);
  });

  const canActRuns = [
    {megacredits: 4, corruptions: [1, 1, 0], expected: false},
    {megacredits: 4, corruptions: [0, 1, 0], expected: false},
    {megacredits: 5, corruptions: [1, 1, 0], expected: false},
    {megacredits: 5, corruptions: [0, 1, 0], expected: true},
  ] as const;

  for (const run of canActRuns) {
    it('canAct ' + JSON.stringify(run), () => {
      player.megaCredits = run.megacredits;
      player.underworldData.corruption = run.corruptions[0];
      player2.underworldData.corruption = run.corruptions[1];
      player3.underworldData.corruption = run.corruptions[2];

      expect(card.canAct(player)).eq(run.expected);
    });
  }

  const actionRuns = [
    {corruptions: [1, 2, 2], target: 2, expected: {targets: [2, 3], corruptions: [1, 1, 2]}},
    {corruptions: [2, 1, 3], target: 3, expected: {targets: [3], corruptions: [2, 1, 2]}},
  ] as const;

  for (const run of actionRuns) {
    it('action ' + JSON.stringify(run), () => {
      function targetToPlayer(target: 2 | 3) {
        if (target === 2) {
          return player2;
        }
        if (target === 3) {
          return player3;
        }
        throw new Error();
      }

      player.megaCredits = 5;
      player.underworldData.corruption = run.corruptions[0];
      player2.underworldData.corruption = run.corruptions[1];
      player3.underworldData.corruption = run.corruptions[2];

      cast(card.action(player), undefined);
      runAllActions(game);

      const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
      expect(selectPlayer.players).to.have.members(run.expected.targets.map(targetToPlayer));
      selectPlayer.cb(targetToPlayer(run.target));
      runAllActions(game);

      cast(player.popWaitingFor(), undefined);

      expect(player.megaCredits).eq(0);
      expect(card.resourceCount).eq(1);
      expect(player.underworldData.corruption).eq(run.expected.corruptions[0]);
      expect(player2.underworldData.corruption).eq(run.expected.corruptions[1]);
      expect(player3.underworldData.corruption).eq(run.expected.corruptions[2]);
    });
  }
});
