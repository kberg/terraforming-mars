import {expect} from 'chai';
import {ResearchDevelopmentHub} from '../../../src/server/cards/underworld/ResearchDevelopmentHub';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, fakeCard, finishGeneration} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {range} from '../../../src/common/utils/utils';

describe('ResearchDevelopmentHub', function() {
  let card: ResearchDevelopmentHub;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ResearchDevelopmentHub();
    [game, player, player2, player3] = testGame(3);
  });

  it('play', function() {
    cast(card.play(player), undefined);
  });

  const generationEndRuns = [
    {p1Cards: 6, p2Cards: 6, p3Cards: 6, expected: 0},
    {p1Cards: 6, p2Cards: 7, p3Cards: 6, expected: 1},
    {p1Cards: 6, p2Cards: 7, p3Cards: 7, expected: 2},
    {p1Cards: 6, p2Cards: 8, p3Cards: 6, expected: 1},
    {p1Cards: 6, p2Cards: 8, p3Cards: 7, expected: 2},
    {p1Cards: 8, p2Cards: 5, p3Cards: 5, expected: 0},
  ] as const;
  for (const run of generationEndRuns) {
    it('generationEnd ' + JSON.stringify(run), () => {
      card.play(player);

      expect(card.resourceCount).eq(0);

      player.playedCards.push(card);
      range(run.p1Cards).forEach(() => player.cardsInHand.push(fakeCard()));
      range(run.p2Cards).forEach(() => player2.cardsInHand.push(fakeCard()));
      range(run.p3Cards).forEach(() => player3.cardsInHand.push(fakeCard()));

      finishGeneration(game);

      expect(card.resourceCount).eq(run.expected);
    });
  }
});
