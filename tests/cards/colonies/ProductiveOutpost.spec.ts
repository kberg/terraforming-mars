import {expect} from 'chai';
import {ProductiveOutpost} from '../../../src/cards/colonies/ProductiveOutpost';
import {Leavitt} from '../../../src/cards/community/colonies/Leavitt';
import {Titania} from '../../../src/cards/community/colonies/Titania';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ProductiveOutpost', function() {
  let card : ProductiveOutpost; let player : Player; let game : Game;

  beforeEach(() => {
    card = new ProductiveOutpost();
    player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    const colony1 = new Luna();
    const colony2 = new Triton();

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);

    game.colonies.push(colony1);
    game.colonies.push(colony2);

    card.play(player);
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).eq(2);
    expect(player.titanium).eq(1);
  });

  it('Works with Titania colony', function() {
    const colony1 = new Luna();
    const colony2 = new Titania();
    player.megaCredits = 0;

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);

    game.colonies.push(colony1);
    game.colonies.push(colony2);

    card.play(player);
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).eq(2);
  });

  it('Works with Leavitt colony', function() {
    const colony1 = new Luna();
    const colony2 = new Leavitt();
    player.megaCredits = 1;

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);

    game.colonies.push(colony1);
    game.colonies.push(colony2);

    card.play(player);
    // Luna
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(3);

    // Leavitt
    game.deferredActions.runNext();
    const action = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    (action as SelectCard<IProjectCard>).cb([action.cards[0]]);
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).eq(0);
    expect(player.cardsInHand).has.length(1);
  });
});
