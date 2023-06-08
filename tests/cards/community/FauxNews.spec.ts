import {expect} from 'chai';
import {FauxNews} from '../../../src/cards/community/corporations/FauxNews';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Misinformation1} from '../../../src/cards/community/misinformation/Misinformation1';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('FauxNews', function() {
  let card : FauxNews; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new FauxNews();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    player.corporationCards = [card];
  });

  it('Corp owner gains 3 M€ OR draws a card when playing Misinformation', function() {
    const misinformation = new Misinformation1();
    player.playCard(misinformation);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;

    // Gain 3 M€
    orOptions.options[0].cb();
    expect(player.megaCredits).eq(9); // 3 from card + 6 from corp effect
    expect(player.cardsInHand).has.length(0);

    // Draw a card
    orOptions.options[1].cb();
    expect(player.megaCredits).eq(9);
    expect(player.cardsInHand).has.length(1);
  });

  it('Other player gains 3 M€ when playing Misinformation', function() {
    const misinformation = new Misinformation1();
    player2.playCard(misinformation);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;

    orOptions.options[0].cb();
    expect(player.megaCredits).eq(3); // 3 from corp effect

    orOptions.options[1].cb();
    expect(player.cardsInHand).has.length(1);

    expect(player2.megaCredits).eq(6); // 3 from card + 3 from corp effect
    expect(player2.cardsInHand).has.length(0);
  });
});
