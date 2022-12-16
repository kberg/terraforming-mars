import {expect} from 'chai';
import {Satellites} from '../../../src/cards/base/Satellites';
import {TransNeptuneProbe} from '../../../src/cards/base/TransNeptuneProbe';
import {SecretSantaSociety} from '../../../src/cards/community/corporations/SecretSantaSociety';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('SecretSantaSociety', function() {
  let card: SecretSantaSociety; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new SecretSantaSociety();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    card.play();
    player.corporationCards = [card];
  });

  it('Can act', function() {
    expect(card.canAct()).to.be.true;
  });

  it('Takes action', function() {
    const satellites = new Satellites();
    player.cardsInHand.push(satellites, new TransNeptuneProbe());

    card.action(player);
    expect(card.resourceCount).to.eq(1);

    const action = card.action(player) as OrOptions;

    // Add science resource
    action.options[0].cb();
    expect(card.resourceCount).to.eq(2);

    // Discard 1 to draw 3
    action.options[1].cb();
    const discardCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(discardCard).instanceOf(SelectCard);

    discardCard.cb([satellites]);
    game.deferredActions.runAll(() => {}); // Draw cards
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player2.cardsInHand).has.lengthOf(1);
    expect(card.resourceCount).to.eq(1);
  });
});
