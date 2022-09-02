import {expect} from 'chai';
import {CorporateArchives} from '../../../src/cards/promo/CorporateArchives';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('CorporateArchives', function() {
  it('Can play', function() {
    const card = new CorporateArchives();
    const player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({preludeExtension: true});
    const game = Game.newInstance('foobar', [player, TestPlayers.RED.newPlayer()], player, gameOptions);

    const action = card.play(player);
    expect(action).instanceOf(SelectCard);

    const card1 = action.cards[0];
    const card2 = action.cards[1];
    action.cb([card1, card2]);

    expect(player.cardsInHand.indexOf(card1)).eq(0);
    expect(player.cardsInHand.indexOf(card2)).eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(game.dealer.discarded).has.lengthOf(5);
    expect(player.megaCredits).to.eq(13);
  });
});
