import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';
import {Resources} from '../../../src/Resources';
import {GreatDamAres} from '../../../src/cards/ares/GreatDamAres';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TestingUtils} from '../../TestingUtils';

describe('GreatDamAres', function() {
  let card: GreatDamAres; let player: Player;

  beforeEach(() => {
    card = new GreatDamAres();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Can play', function() {
    TestingUtils.maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.false;

    TestingUtils.maxOutOceans(player, 4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 4);

    const action = card.play(player) as SelectSpace;
    const space = action.availableSpaces[0];

    action.cb(space);
    expect(space.tile && space.tile.tileType).eq(TileType.GREAT_DAM);

    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.POWER, SpaceBonus.POWER]});
  });
});