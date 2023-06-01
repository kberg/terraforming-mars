import {expect} from 'chai';
import {Supercapacitors} from '../../../src/cards/promo/Supercapacitors';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {SelectAmount} from '../../../src/inputs/SelectAmount';

describe('Supercapacitors', function() {
  let card : Supercapacitors; let player : TestPlayer; let game: Game;

  beforeEach(() => {
    card = new Supercapacitors();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
  });

  it('Effect', function() {
    player.playedCards.push(card);
    player.energy = 4;
    player.setProductionForTest({energy: 4, heat: 4});

    player.runProductionPhase();
    expect(game.deferredActions).has.lengthOf(1);

    const selectAmount = game.deferredActions.pop()!.execute() as SelectAmount;
    selectAmount.cb(2);

    expect(player.heat).to.eq(6);
    expect(player.energy).to.eq(6);
  });
});
