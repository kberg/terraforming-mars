import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';
import {MagneticFieldGeneratorsAres} from '../../../src/cards/ares/MagneticFieldGeneratorsAres';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {TestingUtils} from '../../TestingUtils';
import {SpaceType} from '../../../src/SpaceType';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';

describe('MagneticFieldGeneratorsAres', function() {
  let card: MagneticFieldGeneratorsAres; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new MagneticFieldGeneratorsAres();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Cannot play without enough energy production', function() {
    player.addProduction(Resources.ENERGY, 3);
    expect(card.canPlay(player)).is.false;
  });

  it('Should play', function() {
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);

    player.megaCredits = 0;
    player.plants = 0;
    player.addProduction(Resources.ENERGY, 4);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player) as SelectSpace;
    expect(action).instanceOf(SelectSpace);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(2);
    expect(player.getTerraformRating()).eq(23);

    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).eq(TileType.MAGNETIC_FIELD_GENERATORS);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE]});

    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    const landSpace = adjacentSpaces.find((space) => space.spaceType === SpaceType.LAND)!;
    landSpace.bonus = []; // Just in case it had plant bonuses

    game.addGreenery(player, landSpace.id);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).eq(1); // For Ares tile owner bonus
    expect(player.plants).eq(1);
    expect(tardigrades.resourceCount).eq(1);
  });
});