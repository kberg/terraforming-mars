import {expect} from 'chai';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {PharmacyUnion} from '../../../src/cards/promo/PharmacyUnion';
import {Recyclon} from '../../../src/cards/promo/Recyclon';
import {Splice} from '../../../src/cards/promo/Splice';
import {Game} from '../../../src/Game';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Splice', function() {
  let card : Splice; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new Splice();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    const card2 = new Tardigrades();
    const play = card.play();
    expect(play).is.undefined;

    player.corporationCards = [card];

    player2.playedCards.push(card2);
    const action = card.onCardPlayed(player2, card2) as OrOptions;
    expect(action).instanceOf(OrOptions);

    expect(action.options).has.lengthOf(2);
    const orOptions = action.options[0] as OrOptions;

    orOptions.cb();

    // Give Splice their 2 M€
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(2);

    // Give Tardigrades owner a microbe resource
    game.deferredActions.runNext();
    expect(player2.getResourcesOnCard(card2)).eq(1);
  });

  it('Should play with multiple microbe tags', function() {
    const pharmacyUnion = new PharmacyUnion();
    player.corporationCards = [card];
    player2.corporationCards = [pharmacyUnion];

    const play = card.play();
    const play2 = pharmacyUnion.play(player);
    expect(play).is.undefined;
    expect(play2).is.undefined;

    const action = card.onCardPlayed(player2, pharmacyUnion);
    expect(action).is.undefined;

    // Give Splice their 4 M€ from PU's 2 microbe tags
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(4);

    // Give PU their 4 M€ from PU's 2 microbe tags
    game.deferredActions.runNext();    
    expect(player2.megaCredits).eq(4);
  });

  it('Should grant Recyclon a Microbe or 2 M€', function() {
    const card2 = new Recyclon();
    // Player 1 picks Splice
    const pi = player.getWaitingFor() as AndOptions;
    pi.options[0].cb([card]);
    pi.options[1].cb([]);
    pi.cb();
    // Player 2 picks Recyclon
    const pi2 = player2.getWaitingFor() as AndOptions;
    pi2.options[0].cb([card2]);
    pi2.options[1].cb([]);
    pi2.cb();

    // Default resource on Recyclon and player2's M€
    expect(card2.resourceCount).eq(1);
    expect(player2.megaCredits).eq(38);

    // Player 2 should have the option to pick a microbe or 2 M€
    const pi3 = player2.getWaitingFor() as OrOptions;
    expect(pi3.options).has.lengthOf(2);
    expect(pi3.options[0].title).eq('Add a microbe resource to this card');
    expect(pi3.options[1].title).eq('Gain 2 M€');

    // Give Splice their 2 M€
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(50); // 48 + 2

    // Pick the microbe
    pi3.options[0].cb();
    game.deferredActions.runNext();
    expect(card2.resourceCount).eq(2);

    // Pick 2 M€
    pi3.options[1].cb();
    game.deferredActions.runNext();
    expect(player2.megaCredits).eq(40);
  });
});
