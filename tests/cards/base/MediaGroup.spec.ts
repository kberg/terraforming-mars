import {expect} from 'chai';
import {MediaGroup} from '../../../src/cards/base/MediaGroup';
import {CardType} from '../../../src/cards/CardType';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('MediaGroup', function() {
  it('Should play', function() {
    const card = new MediaGroup();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play();
    expect(action).is.undefined;

    card.onCardPlayed(player, {cardType: CardType.EVENT} as IProjectCard);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).eq(3);

    card.onCardPlayed(player, card);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).eq(3);
  });
});
