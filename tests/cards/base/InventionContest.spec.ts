import {expect} from 'chai';
import {InventionContest} from '../../../src/cards/base/InventionContest';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayers} from '../../TestPlayers';

describe('InventionContest', function() {
  it('Should play', function() {
    const card = new InventionContest();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player)!;
    expect(action).is.undefined;

    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    selectCard.cb([selectCard.cards[0]]);
    expect(game.dealer.discarded).has.lengthOf(2);
    expect(game.dealer.discarded.indexOf(selectCard.cards[0])).eq(-1);
    expect(game.dealer.discarded.indexOf(selectCard.cards[1])).not.eq(-1);
    expect(game.dealer.discarded.indexOf(selectCard.cards[2])).not.eq(-1);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).eq(selectCard.cards[0]);
  });
});
