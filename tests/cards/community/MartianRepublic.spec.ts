import {expect} from 'chai';
import {MartianRepublic} from '../../../src/cards/community/preludes/MartianRepublic';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TileType} from '../../../src/TileType';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('MartianRepublic', function() {
  let card : MartianRepublic; let player : Player; let game : Game;

  beforeEach(() => {
    card = new MartianRepublic();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

    card.play(player);
    game.deferredActions.runNext();

    const selectSpace = game.deferredActions.pop()!.execute() as SelectSpace;
    const space = selectSpace.availableSpaces[0];
    expect(selectSpace.cb(space)).is.undefined;
    expect(space.player).eq(player);
    expect(space.tile).is.not.undefined;
    expect(space.tile!.tileType).eq(TileType.CITY);

    expect(player.megaCredits).to.eq(3);
    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });

  it('Works without Mars First party in play', function() {
    const turmoil = game.turmoil!;
    turmoil.parties = [];

    card.play(player);
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).to.eq(10);
  });
});
