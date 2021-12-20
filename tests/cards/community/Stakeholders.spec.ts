import {expect} from 'chai';
import {CardType} from '../../../src/cards/CardType';
import {Stakeholders} from '../../../src/cards/community/preludes/Stakeholders';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('Stakeholders', function() {
  it('Should play', function() {
    const card = new Stakeholders();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    card.play(player);

    expect(player.megaCredits).eq(14);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand.filter((card) => card.cardType === CardType.EVENT)).has.lengthOf(2);
  });
});
