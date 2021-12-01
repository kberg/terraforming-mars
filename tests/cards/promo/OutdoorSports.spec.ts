import {expect} from 'chai';
import {ISpace} from '../../../src/boards/ISpace';
import {OutdoorSports} from '../../../src/cards/promo/OutdoorSports';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('OutdoorSports', function() {
  let card : OutdoorSports; let player : Player; let player2 : Player;
  let oceanSpace: ISpace; let spaceNextToOcean: ISpace; let spaceNotNextToOcean: ISpace;

  beforeEach(function() {
    card = new OutdoorSports();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);

    const board = player.game.board;
    oceanSpace = board.getAvailableSpacesForOcean(player)[0];

    const spacesNextToOceanSpace = board.getAdjacentSpaces(oceanSpace);
    const citySpaces = board.getAvailableSpacesForCity(player);
    spaceNextToOcean = citySpaces.filter((space) => spacesNextToOceanSpace.includes(space))[0];
    spaceNotNextToOcean = citySpaces.filter((space) => !spacesNextToOceanSpace.includes(space))[0];
  });

  it('cannotPlay', function() {
    player.megaCredits = card.cost;
    player.game.addOceanTile(player, oceanSpace.id);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCityTile(player, spaceNotNextToOcean.id);
    expect(player.canPlay(card)).is.not.true;
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.game.addOceanTile(player, oceanSpace.id);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCityTile(player, spaceNextToOcean.id);
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay - other player owns the city', function() {
    player.megaCredits = card.cost;
    player.game.addOceanTile(player, oceanSpace.id);
    expect(player.canPlay(card)).is.not.true;

    player.game.addCityTile(player2, spaceNextToOcean.id);
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
