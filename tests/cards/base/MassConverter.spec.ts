import {expect} from 'chai';
import {MassConverter} from '../../../src/cards/base/MassConverter';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('MassConverter', function() {
  let card : MassConverter; let player : TestPlayer;

  beforeEach(() => {
    card = new MassConverter();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.tagsForTest = {science: 5};
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).eq(6);
    expect(card.getCardDiscount(player, card)).eq(0);
    expect(card.getCardDiscount(player, {tags: [Tags.SPACE]} as IProjectCard)).eq(2);
  });
});
