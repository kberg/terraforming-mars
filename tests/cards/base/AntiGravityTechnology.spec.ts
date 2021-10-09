import {expect} from 'chai';
import {AntiGravityTechnology} from '../../../src/cards/base/AntiGravityTechnology';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('AntiGravityTechnology', function() {
  let card : AntiGravityTechnology; let player : TestPlayer;

  beforeEach(() => {
    card = new AntiGravityTechnology();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push({tags: Array(7).fill(Tags.SCIENCE)} as IProjectCard);
    expect(card.canPlay(player)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(3);
    expect(card.getCardDiscount()).eq(2);
  });
});
