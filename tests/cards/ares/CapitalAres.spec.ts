import {expect} from 'chai';
import {CapitalAres} from '../../../src/cards/ares/CapitalAres';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/Game';
import {SpaceType} from '../../../src/SpaceType';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('CapitalAres', function() {
  let card : CapitalAres; let player : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new CapitalAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 4; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(5);

    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[1];
    expect(citySpace.spaceType).eq(SpaceType.LAND);
    action.cb(citySpace);

    expect(citySpace.tile).is.not.undefined;
    expect(citySpace.player).eq(player);
    expect(citySpace.tile && citySpace.tile.tileType).eq(TileType.CAPITAL);
    expect(player.victoryPointsBreakdown.victoryPoints).eq(0);
    expect(card.getVictoryPoints(player)).eq(1);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
