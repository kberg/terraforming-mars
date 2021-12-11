import {expect} from 'chai';
import {FieldCappedCity} from '../../../src/cards/promo/FieldCappedCity';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('FieldCappedCity', function() {
  it('Should play', function() {
    const card = new FieldCappedCity();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).eq(TileType.CITY);
    expect(player.plants).eq(3);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
  });
});

