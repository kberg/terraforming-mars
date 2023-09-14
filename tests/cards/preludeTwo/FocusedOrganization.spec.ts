import {expect} from 'chai';
import {FocusedOrganization} from '../../../src/cards/preludeTwo/FocusedOrganization';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Mine} from '../../../src/cards/base/Mine';

describe('FocusedOrganization', function() {
  let card : FocusedOrganization; let player : Player; let game: Game;

  beforeEach(() => {
    card = new FocusedOrganization();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    const orOptions = card.play(player) as OrOptions;
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.length(1);

    orOptions.options[0].cb();
    expect(player.titanium).eq(1);

    orOptions.options[3].cb();
    expect(player.energy).eq(1);
  });

  it('canAct', function() {
    expect(card.canAct(player)).is.false;

    player.megaCredits = 1;
    expect(card.canAct(player)).is.false;

    player.cardsInHand.push(new Mine());
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    player.megaCredits = 10;
    player.heat = 10;
    player.playedCards.push(new Mine());

    const action = card.action(player);
    expect(action).is.undefined;

    // Discard 1 card
    game.deferredActions.pop()!.execute();
    expect(player.cardsInHand).has.length(0);

    // Spend 1 standard resource
    const spendResource = game.deferredActions.pop()!.execute() as OrOptions;
    spendResource.options[1].cb()
    expect(player.heat).eq(9);

    // Draw 1 card
    game.deferredActions.pop()!.execute();
    expect(player.cardsInHand).has.length(1);

    // Gain 1 standard resource
    const gainResource = game.deferredActions.pop()!.execute() as OrOptions;
    gainResource.options[2].cb()
    expect(player.plants).eq(1);
  });
});
