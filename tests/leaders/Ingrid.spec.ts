import {expect} from "chai";
import {Ants} from "../../src/cards/base/Ants";
import {Satellites} from "../../src/cards/base/Satellites";
import {IProjectCard} from "../../src/cards/IProjectCard";
import {Ingrid} from "../../src/cards/leaders/Ingrid";
import {Game} from "../../src/Game";
import {SelectCard} from "../../src/inputs/SelectCard";
import {Phase} from "../../src/Phase";
import {Player} from "../../src/Player";
import {SpaceType} from "../../src/SpaceType";
import {TileType} from "../../src/TileType";
import {TestPlayers} from "../TestPlayers";

describe('Ingrid', function() {
  let card: Ingrid; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Ingrid();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.playedCards.push(card);
  });

  it('Ability does not trigger if player has no cards', function() {
    game.addGreenery(player, '35');
    expect(game.deferredActions).has.length(0);
  });

  it('Can discard and draw a card when taking action to place tile on Mars', function() {
    player.cardsInHand.push(new Satellites(), new Ants());

    game.addGreenery(player, '35');
    expect(game.deferredActions).has.length(2);

    // Discard card
    const discardCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    discardCard.cb([player.cardsInHand[0]]);
    expect(player.cardsInHand).has.length(1);

    game.deferredActions.runNext(); // Draw card
    expect(player.cardsInHand).has.length(2);
  });

  it('Does not trigger ability when placing ocean during WGT', function() {
    game.phase = Phase.SOLAR;
    game.addTile(player, SpaceType.OCEAN, game.board.spaces.find((space) => space.spaceType === SpaceType.OCEAN)!, {
      tileType: TileType.OCEAN,
    });

    expect(game.deferredActions).has.length(0);
  });

  it('Does not trigger ability when placing tile off Mars', function() {
    game.addTile(player, SpaceType.COLONY, game.board.spaces.find((space) => space.spaceType === SpaceType.COLONY)!, {
      tileType: TileType.CITY,
    });

    expect(game.deferredActions).has.length(0);
  });
});
