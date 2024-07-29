import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {MartianEmbassy} from '../../../src/server/cards/moon/MartianEmbassy';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';

describe('MartianEmbassy', () => {
  let player: TestPlayer;
  let card: MartianEmbassy;
  let game: IGame;

  beforeEach(() => {
    [game, player] = testGame(1, {pathfindersExpansion: true});
    card = new MartianEmbassy();
  });

  const playRuns = [
    {tags: 1, expected: 0},
    {tags: 2, expected: 1},
    {tags: 3, expected: 1},
    {tags: 4, expected: 1},
    {tags: 5, expected: 2},
  ];
  for (const run of playRuns) {
    it('play ' + JSON.stringify(run), () => {
      player.playedCards.push(fakeCard({tags: Array(run.tags).fill(Tag.MOON)}));
      card.play(player);
      expect(game.pathfindersData!.mars).eq(run.expected);
    });
  }
});

