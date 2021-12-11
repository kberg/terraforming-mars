import {expect} from 'chai';
import {MiningRights} from '../../../src/cards/base/MiningRights';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('MiningRights', () => {
  let card : MiningRights; let player : Player; let game : Game;

  beforeEach(() => {
    card = new MiningRights();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play if no available spaces', () => {
    for (const land of game.board.getAvailableSpacesOnLand(player)) {
      if (land.bonus.includes(SpaceBonus.STEEL) || land.bonus.includes(SpaceBonus.TITANIUM)) {
        game.addTile(player, land.spaceType, land, {tileType: TileType.MINING_RIGHTS});
      }
    }
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const titaniumSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false);
    expect(titaniumSpace).is.not.undefined;
    expect(titaniumSpace!.bonus).contains(SpaceBonus.TITANIUM);

    action.cb(titaniumSpace!);
    game.deferredActions.runNext();

    expect(titaniumSpace!.player).eq(player);
    expect(titaniumSpace!.tile && titaniumSpace!.tile!.tileType).eq(TileType.MINING_RIGHTS);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    expect(titaniumSpace!.adjacency?.bonus).eq(undefined);

    const steelSpace = action.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL));
    expect(steelSpace).is.not.undefined;
    expect(steelSpace!.bonus).contains(SpaceBonus.STEEL);

    action.cb(steelSpace!);
    game.deferredActions.runNext();

    expect(steelSpace!.player).eq(player);
    expect(steelSpace!.tile && steelSpace!.tile!.tileType).eq(TileType.MINING_RIGHTS);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    expect(steelSpace!.adjacency?.bonus).eq(undefined);
  });
});
