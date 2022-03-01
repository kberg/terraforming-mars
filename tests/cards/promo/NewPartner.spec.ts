import {expect} from 'chai';
import {CardType} from '../../../src/cards/CardType';
import {ICard} from '../../../src/cards/ICard';
import {Donation} from '../../../src/cards/prelude/Donation';
import {GalileanMining} from '../../../src/cards/prelude/GalileanMining';
import {HugeAsteroid} from '../../../src/cards/prelude/HugeAsteroid';
import {NewPartner} from '../../../src/cards/promo/NewPartner';
import {SmeltingPlant} from '../../../src/cards/prelude/SmeltingPlant';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('NewPartner', function() {
  let card : NewPartner; let player : Player; let game : Game;

  beforeEach(() => {
    card = new NewPartner();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play with at least 1 playable prelude', function() {
    game.dealer.preludeDeck.push(new SmeltingPlant(), new Donation());

    const selectCard = card.play(player) as SelectCard<ICard>;
    selectCard.cb([selectCard.cards[0]]);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.playedCards.every((card) => card.cardType === CardType.PRELUDE)).is.true;
  });

  it('Can play with no playable preludes drawn', function() {
    player.megaCredits = 0;
    game.dealer.preludeDeck.push(new HugeAsteroid(), new GalileanMining());

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
