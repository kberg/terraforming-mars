import {expect} from 'chai';
import {AsteroidMining} from '../../../src/cards/base/AsteroidMining';
import {KelpFarming} from '../../../src/cards/base/KelpFarming';
import {ICard} from '../../../src/cards/ICard';
import {Donation} from '../../../src/cards/prelude/Donation';
import {EccentricSponsor} from '../../../src/cards/prelude/EccentricSponsor';
import {EcologyExperts} from '../../../src/cards/prelude/EcologyExperts';
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

  it('Works with Eccentric Sponsor', function() {
    player.playedCards.push(new EccentricSponsor());
    const asteroidMining = new AsteroidMining();
    expect(player.getCardCost(asteroidMining)).eq(30);

    player.playCard(card);
    expect(player.lastCardPlayed!.name).to.eq(card.name);
    expect(player.cardDiscount).to.eq(0);

    game.deferredActions.runNext();
    game.deferredActions.runNext();
    expect(player.cardDiscount).to.eq(25);
    expect(player.getCardCost(asteroidMining)).eq(5);

    game.deferredActions.runAll(() => {});
    expect(player.cardDiscount).to.eq(0);
  });

  it('Works with Ecology Experts', function() {
    player.playedCards.push(new EcologyExperts());
    player.megaCredits = 50;

    const kelpFarming = new KelpFarming();
    expect(player.canPlay(kelpFarming)).is.false;

    player.playCard(card);
    expect(player.lastCardPlayed!.name).to.eq(card.name);
    expect(player.requirementsBonus).to.eq(0);

    game.deferredActions.runNext();
    game.deferredActions.runNext();
    expect(player.requirementsBonus).to.eq(50);
    expect(player.canPlay(kelpFarming)).is.true;

    game.deferredActions.runAll(() => {});
    expect(player.requirementsBonus).to.eq(0);
  });
});
