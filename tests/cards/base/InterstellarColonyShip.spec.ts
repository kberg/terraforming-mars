import {expect} from 'chai';
import {InterstellarColonyShip} from '../../../src/cards/base/InterstellarColonyShip';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('InterstellarColonyShip', function() {
  let card : InterstellarColonyShip; let player : TestPlayer;

  beforeEach(() => {
    card = new InterstellarColonyShip();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push({tags: Array(5).fill(Tags.SCIENCE)} as IProjectCard);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(4);
  });
});
