import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {Donation} from '../../../src/cards/prelude/Donation';
import {GalileanMining} from '../../../src/cards/prelude/GalileanMining';
import {PowerGeneration} from '../../../src/cards/prelude/PowerGeneration';
import {DoubleDown} from '../../../src/cards/promo/DoubleDown';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('DoubleDown', function() {
  let card : DoubleDown; let player : Player; let game : Game;

  beforeEach(() => {
    card = new DoubleDown();
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('foobar', [player], player, gameOptions);
  });

  it('Cannot play as first prelude', function() {
    player.playedCards = [];
    player.preludeCardsInHand = [card, new Donation()];
    expect(card.canPlay(player)).is.false;
  });

  it('Can play as second prelude', function() {
    player.playedCards.push(new Donation());

    card.play(player);
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).to.eq(21);
  });

  it('Ignores unplayable preludes', function() {
    player.playedCards.push(new GalileanMining());

    // Cannot afford
    player.megaCredits = 0;
    expect(card.canPlay(player)).is.false;

    // Can afford
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    game.deferredActions.runAll(() => {});
    expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
  });

  it('Works with multiple played preludes', function() {
    player.playedCards.push(new Donation(), new PowerGeneration());

    const selectCard = card.play(player) as SelectCard<ICard>;
    selectCard.cb([selectCard.cards[1]]);
    game.deferredActions.runAll(() => {});
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
