import {expect} from 'chai';
import {GreenMarsInitiative} from '../../../src/cards/community/preludes/GreenMarsInitiative';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TileType} from '../../../src/TileType';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('GreenMarsInitiative', function() {
  let card : GreenMarsInitiative; let player : Player; let game : Game;

  beforeEach(() => {
    card = new GreenMarsInitiative();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;

    card.play(player);
    game.deferredActions.runNext();

    const selectSpace = game.deferredActions.pop()!.execute() as SelectSpace;
    const space = selectSpace.availableSpaces[0];
    expect(selectSpace.cb(space)).is.undefined;
    expect(space.player).eq(player);
    expect(space.tile).is.not.undefined;
    expect(space.tile!.tileType).eq(TileType.GREENERY);

    expect(greens.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });

  it('Works without Greens party in play', function() {
    const turmoil = game.turmoil!;
    turmoil.parties = [];

    card.play(player);
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).to.eq(7);
  });
});
