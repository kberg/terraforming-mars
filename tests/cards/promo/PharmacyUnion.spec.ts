import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/cards/base/AdvancedEcosystems';
import {Ants} from '../../../src/cards/base/Ants';
import {Fish} from '../../../src/cards/base/Fish';
import {LagrangeObservatory} from '../../../src/cards/base/LagrangeObservatory';
import {Lichen} from '../../../src/cards/base/Lichen';
import {MediaGroup} from '../../../src/cards/base/MediaGroup';
import {Research} from '../../../src/cards/base/Research';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {Virus} from '../../../src/cards/base/Virus';
import {PharmacyUnion} from '../../../src/cards/promo/PharmacyUnion';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Splice} from '../../../src/cards/promo/Splice';
import {Faraday} from '../../../src/cards/leaders/Faraday';
import {ExtremeColdFungus} from '../../../src/cards/base/ExtremeColdFungus';
import {IndustrialMicrobes} from '../../../src/cards/base/IndustrialMicrobes';
import {TestPlayer} from '../../TestPlayer';

describe('PharmacyUnion', function() {
  let card : PharmacyUnion; let player : TestPlayer; let player2 : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new PharmacyUnion();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.popWaitingFor(); // Remove SelectInitialCards
    player.corporationCards = [card];
  });

  it('Should play', function() {
    Game.newInstance('foobar', [player], player);
    const pi = player.getWaitingFor() as AndOptions;
    pi.options[0].cb([card]);
    pi.options[1].cb([]);
    pi.cb();

    expect(card.resourceCount).eq(2);
    // Should not pay for the free Science card
    expect(player.megaCredits).eq(46);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].tags.includes(Tags.SCIENCE)).is.true;
  });

  it('Gains diseases and removes M€ when ANY player plays microbe cards', function() {
    player.megaCredits = 8;
    player2.megaCredits = 8;
    card.play(player);

    const ants = new Ants();
    player.playedCards.push(ants);
    card.onCardPlayed(player, ants);
    game.deferredActions.runNext(); // Add microbe and lose 4 M€
    expect(card.resourceCount).eq(3);
    expect(player.megaCredits).eq(4);

    const viralEnhancers = new ViralEnhancers();
    player2.playedCards.push(viralEnhancers);
    card.onCardPlayed(player2, viralEnhancers);
    game.deferredActions.runNext(); // Add microbe and lose 4 M€
    expect(player2.megaCredits).eq(8); // should not change
    expect(card.resourceCount).eq(4);
    expect(player.megaCredits).eq(0);
  });

  it('Removes diseases and gives TR only when corp owner plays science cards', function() {
    card.play(player);

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    card.onCardPlayed(player, searchForLife);
    expect(game.deferredActions).has.lengthOf(1);
    expect(game.deferredActions.peek()!.execute()).is.undefined;
    game.deferredActions.pop();

    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(21);

    const lagrangeObservatory = new LagrangeObservatory();
    player2.playedCards.push(lagrangeObservatory);
    card.onCardPlayed(player2, lagrangeObservatory);
    expect(game.deferredActions).has.lengthOf(0);
    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Works correctly with Research', function() {
    card.play(player);
    expect(card.resourceCount).eq(2);

    const research = new Research();
    player.playedCards.push(research);
    card.onCardPlayed(player, research);
    expect(game.deferredActions).has.lengthOf(2);
    expect(game.deferredActions.peek()!.execute()).is.undefined;
    game.deferredActions.pop();
    expect(game.deferredActions.peek()!.execute()).is.undefined;
    game.deferredActions.pop();

    expect(card.resourceCount).eq(0);
    expect(player.getTerraformRating()).eq(22);
  });

  it('Can turn card face down once per game to gain 3 TR if no diseases on card', function() {
    card.resourceCount = 0;

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    card.onCardPlayed(player, searchForLife);
    expect(game.deferredActions).has.lengthOf(1);
    expect(player.getPlayedEventsCount()).eq(0);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
    orOptions.options[0].cb();

    expect(player.getTerraformRating()).eq(23);
    expect(card.isDisabled).is.true;
    expect(player.getPlayedEventsCount()).eq(1); // Counts as a played event

    // Cannot trigger once per game effect a second time
    card.onCardPlayed(player, searchForLife);
    expect(game.deferredActions).has.lengthOf(0);
    expect(player.getTerraformRating()).eq(23);
  });

  it('Corporation tags do not count when corporation is disabled', function() {
    expect(player.getTagCount(Tags.MICROBE)).eq(2);
    const advancedEcosystems = new AdvancedEcosystems();
    player.playedCards.push(new Fish());
    player.playedCards.push(new Lichen());
    expect(advancedEcosystems.canPlay(player)).is.true;

    card.resourceCount = 0;
    card.onCardPlayed(player, new SearchForLife());

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(card.isDisabled).is.true;
    expect(player.getTagCount(Tags.MICROBE)).eq(0);
    expect(advancedEcosystems.canPlay(player)).is.false;
  });

  it('Edge Case - Let player pick the tag resolution order', function() {
    // Edge case, let player pick order of resolution
    // see https://github.com/terraforming-mars/terraforming-mars/issues/1286

    player.megaCredits = 12;
    const viralEnhancers = new ViralEnhancers();

    // Another player playing a Science/Microbes card and Pharmacy Union has no resource
    card.resourceCount = 0;
    player2.playedCards.push(viralEnhancers);
    card.onCardPlayed(player2, viralEnhancers);
    game.deferredActions.runNext(); // Add microbe and lose 4 M€
    expect(card.resourceCount).eq(1);
    expect(player.megaCredits).eq(8);
    expect(game.deferredActions).has.lengthOf(0);

    // PU player playing a Science/Microbes card and Pharmacy Union has no resource
    card.resourceCount = 0;
    player.playedCards.push(viralEnhancers);
    card.onCardPlayed(player, viralEnhancers);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[1].cb(); // Add disease then remove it
    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(4);

    orOptions.options[0].cb(); // Turn face down then lose 4 M€
    expect(card.isDisabled).is.true;
    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(0);
  });

  it('Edge Case - Lose M€ before gaining', () => {
    // See https://github.com/terraforming-mars/terraforming-mars/issues/2191
    player.megaCredits = 0;
    player.playedCards = [new MediaGroup()];
    player.playCard(new Virus());
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).eq(3);
  });

  it('Edge Case - With Splice and Faraday, gains M€ first and can choose to spend 3 M€ to draw a card before losing M€', () => {
    player.megaCredits = 1;
    player.corporationCards.push(new Splice());
    player.playedCards = [new Faraday(), new ExtremeColdFungus()];

    player.playCard(new IndustrialMicrobes());
    expect(game.deferredActions).has.length(4);

    // Splice triggers first
    game.deferredActions.runNext();
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(5);

    // Faraday triggers next
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb(); // Pay 3 M€ to draw a card
    game.deferredActions.runNext(); // Clear the SelectHowToPayDeferred
    expect(player.megaCredits).eq(2);
    expect(player.cardsInHand).has.length(1);

    // PU triggers last, removing up to 4 M€
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).eq(0);
  });

  it('Edge Case - With Splice and Faraday, loses M€ for PU first before gaining M€ from Splice if might not be able to afford 3 M€ to draw a card', () => {
    // Player may not be able to afford 3 M€ to draw a card even after Splice gives 2 M€, as they can choose to add a microbe resource instead
    player.megaCredits = 0;
    player.corporationCards.push(new Splice());
    player.playedCards = [new Faraday(), new ExtremeColdFungus()];

    player.playCard(new Ants());
    expect(game.deferredActions).has.length(4);

    // PU triggers first
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(0);

    // Splice triggers next
    game.deferredActions.runNext();
    const orOptions = player.getWaitingFor() as OrOptions;
    // Pick 2 M€
    orOptions.options[1].cb();
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(2);

    // Give Splice owner their 2 M€
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(4);

    const faradayOptions = game.deferredActions.pop()!.execute() as OrOptions;
    faradayOptions.options[0].cb();
    // Clear the SelectHowToPayDeferred
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.length(1);
    expect(player.megaCredits).to.eq(1);
  });
});
