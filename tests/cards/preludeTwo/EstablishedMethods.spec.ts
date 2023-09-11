import {expect} from 'chai';
import {EstablishedMethods} from '../../../src/cards/preludeTwo/EstablishedMethods';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {StandardProjectCard} from '../../../src/cards/StandardProjectCard';

describe('EstablishedMethods', function() {
  let card : EstablishedMethods; let player : Player;

  beforeEach(() => {
    card = new EstablishedMethods();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    let selectStandardProject: SelectCard<StandardProjectCard> | undefined;

    selectStandardProject = card.play(player) as SelectCard<StandardProjectCard>;
    expect(player.megaCredits).eq(30);

    // First do an SP asteroid
    const firstResult = selectStandardProject.cb([selectStandardProject.cards[1]]) as SelectCard<StandardProjectCard>;
    player.game.deferredActions.runNext(); // Clear SelectHowToPayDeferred
    expect(player.megaCredits).eq(16);

    // Only SP Power Plant and Asteroid are affordable
    expect(firstResult instanceof SelectCard).is.true;
    expect(firstResult.cards).has.length(2);

    // Next do another SP asteroid
    const secondResult = firstResult.cb([selectStandardProject.cards[1]]);
    player.game.deferredActions.runNext(); // Clear SelectHowToPayDeferred
    expect(player.megaCredits).eq(2);

    // Action ends here as we cannot afford any more SPs
    expect(secondResult).is.undefined;
  });

  it('Play: can use extra available M€', function() {
    let selectStandardProject: SelectCard<StandardProjectCard> | undefined;
    player.megaCredits = 20;

    selectStandardProject = card.play(player) as SelectCard<StandardProjectCard>;
    expect(player.megaCredits).eq(50);

    // First do an SP asteroid
    const firstResult = selectStandardProject.cb([selectStandardProject.cards[1]]) as SelectCard<StandardProjectCard>;
    player.game.deferredActions.runNext(); // Clear SelectHowToPayDeferred
    expect(player.megaCredits).eq(36);

    // All SP options are still affordable
    expect(firstResult instanceof SelectCard).is.true;
    expect(firstResult.cards.length).greaterThan(2);

    // Next do another SP asteroid
    const secondResult = firstResult.cb([selectStandardProject.cards[1]]) as SelectCard<StandardProjectCard>;
    player.game.deferredActions.runNext(); // Clear SelectHowToPayDeferred
    expect(player.megaCredits).eq(22);

    // We have only spent 28 M€ so far, and need to spend at least 2 M€ more
    expect(secondResult instanceof SelectCard).is.true;
    expect(secondResult.cards.length).greaterThan(2);

    // Do an SP power plant for the last SP 
    const finalResult = secondResult.cb([selectStandardProject.cards[0]]);
    player.game.deferredActions.runNext(); // Clear SelectHowToPayDeferred
    expect(player.megaCredits).eq(11);

    // Action ends here as we have already spent at least 30 M€
    expect(finalResult).is.undefined;
  });
});
