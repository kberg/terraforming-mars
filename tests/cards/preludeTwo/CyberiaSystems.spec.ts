import {expect} from 'chai';
import {CyberiaSystems} from '../../../src/cards/preludeTwo/CyberiaSystems';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {DeepWellHeating} from '../../../src/cards/base/DeepWellHeating';
import {Mine} from '../../../src/cards/base/Mine';
import {GHGFactories} from '../../../src/cards/base/GHGFactories';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';
import {Resources} from '../../../src/Resources';

describe('CyberiaSystems', function() {
  let card : CyberiaSystems; let player : Player; let player2 : Player;

  beforeEach(() => {
    card = new CyberiaSystems();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('cannot play - less than 2 copyable cards', function() {
    expect(card.canPlay(player)).is.false;

    player.playedCards.push(new Mine());
    expect(card.canPlay(player)).is.false;

    player.playedCards.push(new GHGFactories());
    expect(card.canPlay(player)).is.false;
  });

  it('can play - at least 2 copyable cards', function() {
    player.playedCards.push(new Mine(), new DeepWellHeating());
    expect(card.canPlay(player)).is.true;
  });

  it('can play - second card becomes copyable after copying the first', function() {
    player.playedCards.push(new GHGFactories());
    expect(card.canPlay(player)).is.false;

    player.playedCards.push(new DeepWellHeating());
    expect(card.canPlay(player)).is.true;
  });

  it('Play', function() {
    player.playedCards.push(new DeepWellHeating(), new GHGFactories());

    const selectFirstCard = card.play(player) as SelectCard<ICard>;
    expect(player.getProduction(Resources.STEEL)).eq(1);

    expect(selectFirstCard.cards).has.length(1);
    const selectSecondCard = selectFirstCard.cb([selectFirstCard.cards[0]]) as SelectCard<ICard>;
    expect(player.getProduction(Resources.ENERGY)).eq(1);

    expect(selectSecondCard.cards).has.length(1);
    selectSecondCard.cb([selectSecondCard.cards[0]]);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.HEAT)).eq(4);
  });
});
