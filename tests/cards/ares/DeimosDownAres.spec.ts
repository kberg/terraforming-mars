import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';
import {DeimosDownAres} from '../../../src/cards/ares/DeimosDownAres';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('DeimosDownAres', function() {
  let card: DeimosDownAres; let player: Player; let player2: Player;

  beforeEach(() => {
    card = new DeimosDownAres();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play without plants', function() {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    expect(player.game.getTemperature()).eq(-24);
    expect(player.steel).eq(4);
    const input = player.game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  it('Can remove plants', function() {
    player2.plants = 5;

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).eq(TileType.DEIMOS_DOWN);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.ASTEROID, SpaceBonus.STEEL]});

    expect(player.game.getTemperature()).eq(-24);
    // In case tile placement gives some additional steel
    expect(player.steel).gte(4);

    expect(player.game.deferredActions).has.lengthOf(1);

    // Choose Remove 5 plants option
    const orOptions = player.game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[0].cb([player2]);

    expect(player2.plants).eq(0);
  });

  it('Works fine in solo mode', function() {
    Game.newInstance('foobar', [player], player);

    player.plants = 15;
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    expect(player.game.getTemperature()).eq(-24);
    expect(player.steel).eq(4);
    expect(player.plants).eq(15); // not removed
  });
});