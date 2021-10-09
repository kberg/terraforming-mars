import {expect} from 'chai';
import {QuantumExtractor} from '../../../src/cards/base/QuantumExtractor';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('QuantumExtractor', function() {
  let card : QuantumExtractor; let player : Player;

  beforeEach(() => {
    card = new QuantumExtractor();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card);
    card.play(player);
    expect(card.getCardDiscount(player, {tags: [Tags.SPACE]} as IProjectCard)).eq(2);
    expect(card.getCardDiscount(player, {tags: [Tags.PLANT]} as IProjectCard)).eq(0);
  });
});
