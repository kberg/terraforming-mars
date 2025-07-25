import {expect} from 'chai';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {MarsUniversity} from '../../../src/server/cards/base/MarsUniversity';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {Research} from '../../../src/server/cards/base/Research';
import {AdaptationTechnology} from '../../../src/server//cards/base/AdaptationTechnology';
import {DeferredActionsQueue} from '../../../src/server/deferredActions/DeferredActionsQueue';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {HyperspaceDrivePrototype} from '../../../src/server/cards/underworld/HyperspaceDrivePrototype';

describe('OlympusConference', () => {
  let card: OlympusConference;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new OlympusConference();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    player.playedCards.push(card);
    card.play(player);

    expect(card.getVictoryPoints(player)).to.eq(1);

    card.onCardPlayed(player, new Bushes());
    expect(game.deferredActions).has.lengthOf(0);

    // No resource
    card.onCardPlayed(player, card);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).to.eq(1);

    // Resource available
    card.onCardPlayed(player, card);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[1].cb();
    expect(card.resourceCount).to.eq(2);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('including this', () => {
    player.cardsInHand = [card];
    player.playCard(card, undefined);
    expect(card.resourceCount).to.eq(0);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Plays twice for Research', () => {
    player.playedCards.push(card);
    card.onCardPlayed(player, new Research());
    expect(game.deferredActions).has.lengthOf(2);

    // No resource, can't draw, resource automatically added
    const input = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(1);

    // Resource on card, can draw
    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);

    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Triggers before Mars University', () => {
    const marsUniversity = new MarsUniversity();
    const scienceTagCard = new AdaptationTechnology();

    // Olypus Conference played before Mars University
    player.playedCards.push(card);
    player.playedCards.push(marsUniversity);
    card.resourceCount = 1;

    // Play a 1 science tag card
    player.playCard(scienceTagCard);

    // OC asking to draw & MU asking to discard
    expect(game.deferredActions).has.lengthOf(2);

    // OC's trigger should be the first one
    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[1].cb();
    expect(card.resourceCount).to.eq(2);


    // Reset the state
    game.deferredActions = new DeferredActionsQueue();
    player.playedCards.set();


    // Mars University played before Olympus Conference
    player.playedCards.push(marsUniversity);
    player.playedCards.push(card);
    card.resourceCount = 1;

    // Play a 1 science tag card
    player.playCard(scienceTagCard);

    // OC asking to draw & MU asking to discard
    expect(game.deferredActions).has.lengthOf(2);

    // OC's trigger should be the first one
    const orOptions2 = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions2.options[1].cb();
    expect(card.resourceCount).to.eq(2);
  });

  it('Compatible with Leavitt #6349', () => {
    player.playedCards.push(card);
    const leavitt = new Leavitt();
    leavitt.addColony(player);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).to.eq(1);
  });

  it('Allows for resource to be added first when Hyperspace Drive Prototype is played', () => {
    player.playedCards.push(card);
    card.resourceCount = 0;
    const hyperspaceDrivePrototype = new HyperspaceDrivePrototype();
    player.playCard(hyperspaceDrivePrototype);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[0].cb();

    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
