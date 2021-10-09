import {expect} from 'chai';
import {QuantumExtractor} from '../../../src/cards/base/QuantumExtractor';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('QuantumExtractor', function() {
  let card : QuantumExtractor; let player : TestPlayer;

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
    player.tagsForTest = {science: 4};
    card.play(player);
    expect(card.getCardDiscount(player, {tags: [Tags.SPACE]} as IProjectCard)).eq(2);
    expect(card.getCardDiscount(player, {tags: [Tags.PLANT]} as IProjectCard)).eq(0);
  });
});
