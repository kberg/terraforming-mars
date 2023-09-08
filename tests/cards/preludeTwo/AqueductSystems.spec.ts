import {expect} from 'chai';
import {AqueductSystems} from '../../../src/cards/preludeTwo/AqueductSystems';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Tags} from '../../../src/cards/Tags';
import {ISpace} from '../../../src/boards/ISpace';

describe('AqueductSystems', function() {
  let card : AqueductSystems; let player : Player; let player2 : Player;
  let oceanSpace: ISpace; let spaceNextToOcean: ISpace; let spaceNotNextToOcean: ISpace;

  beforeEach(() => {
    card = new AqueductSystems();
    
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
    expect(player.canPlay(card)).is.false;

    player.game.addCityTile(player, spaceNotNextToOcean.id);
    expect(player.canPlay(card)).is.false;
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.game.addOceanTile(player, oceanSpace.id);
    expect(player.canPlay(card)).is.false;

    player.game.addCityTile(player, spaceNextToOcean.id);
    expect(player.canPlay(card)).is.true;
  });

  it('Play', function() {
    card.play(player);

    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand.every((card) => card.tags.includes(Tags.BUILDING))).is.true;
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
