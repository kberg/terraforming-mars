import {expect} from 'chai';
import {DustSeals} from '../../../src/cards/base/DustSeals';
import {HeatTrappers} from '../../../src/cards/base/HeatTrappers';
import {CuttingEdgeTechnology} from '../../../src/cards/promo/CuttingEdgeTechnology';
import {VoteOfNoConfidence} from '../../../src/cards/turmoil/VoteOfNoConfidence';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('CuttingEdgeTechnology', function() {
  it('Should play', function() {
    const card = new CuttingEdgeTechnology();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    card.play();

    const discountedCard = new DustSeals();
    const discountedCard2 = new VoteOfNoConfidence();
    const undiscountedCard = new HeatTrappers();

    expect(card.getCardDiscount(player, discountedCard)).eq(2);
    expect(card.getCardDiscount(player, discountedCard2)).eq(2);
    expect(card.getCardDiscount(player, undiscountedCard)).eq(0);
    expect(card.getVictoryPoints()).eq(1);
  });
});
