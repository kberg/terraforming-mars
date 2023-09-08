import {expect} from 'chai';
import {StJosephOfCupertinoMission} from '../../../src/cards/preludeTwo/StJosephOfCupertinoMission';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestingUtils} from '../../TestingUtils';

describe('StJosephOfCupertinoMission', function() {
  let card : StJosephOfCupertinoMission; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new StJosephOfCupertinoMission();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('canAct', function() {
    player.megaCredits = 0;
    expect(card.canAct(player)).is.false;

    player.megaCredits = 5;
    expect(card.canAct(player)).is.false;

    const citySpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addCityTile(player, citySpace.id);
    expect(card.canAct(player)).is.true;

    player.megaCredits = 4;
    player.steel = 1;
    expect(card.canAct(player)).is.true;

    citySpace.hasCathedral = true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    // Setup
    player.megaCredits = 7;
    player.cardsInHand = [];
    const citySpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addCityTile(player, citySpace.id);
    player.steel = 0; // Clear any possible steel gained from placing the city

    expect(card.action(player)).is.undefined;
    // SelectHowToPayDeferred
    expect(game.deferredActions).has.length(1); 
    game.deferredActions.runNext();

    const selectSpace = game.deferredActions.pop()!.execute() as SelectSpace;
    const space = selectSpace.availableSpaces[0];
    expect(space.id).to.eq(citySpace.id);

    selectSpace.cb(space);
    expect(space.hasCathedral).is.true;

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[1].cb(); // Do nothing
    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).eq(2);

    orOptions.options[0].cb(); // Pay 2 M€ to draw a card
    TestingUtils.runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).eq(0);
  });

  it('Gives VP', function() {
    expect(card.getVictoryPoints(player)).eq(0);

    const citySpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addCityTile(player, citySpace.id);
    citySpace.hasCathedral = true;
    expect(card.getVictoryPoints(player)).eq(1);
  });
});
