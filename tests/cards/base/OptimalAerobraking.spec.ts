import {expect} from 'chai';
import {OptimalAerobraking} from '../../../src/cards/base/OptimalAerobraking';
import {CardType} from '../../../src/cards/CardType';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('OptimalAerobraking', function() {
  it('Should play', function() {
    const card = new OptimalAerobraking();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    expect(card.onCardPlayed(player, card)).is.undefined;
    expect(card.onCardPlayed(player, {tags: [Tags.SPACE, Tags.EVENT], cardType: CardType.EVENT} as IProjectCard)).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
