import {expect} from 'chai';
import {TychoMagnetics} from '../../../src/cards/preludeTwo/TychoMagnetics';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SelectAmount} from '../../../src/inputs/SelectAmount';

describe('TychoMagnetics', function() {
  let card : TychoMagnetics; let player : Player;

  beforeEach(() => {
    card = new TychoMagnetics();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
  });

  it('Cannot act', function() {
    player.energy = 0;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    player.addResource(Resources.ENERGY, 5);
    expect(card.canAct(player)).is.true;

    const amount = card.action(player) as SelectAmount;
    expect(amount).instanceOf(SelectAmount);

    amount.cb(3);
    expect(player.getResource(Resources.ENERGY)).eq(2);
  });

  it('If only 1 energy is available, draw the card directly', function() {
    player.addResource(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    expect(action).is.undefined;

    expect(player.getResource(Resources.ENERGY)).eq(0);
    expect(player.cardsInHand).has.length(1);
  });

  it('If only 1 energy is spent, draw the card directly', function() {
    player.addResource(Resources.ENERGY, 5);
    expect(card.canAct(player)).is.true;

    const amount = card.action(player) as SelectAmount;
    expect(amount).instanceOf(SelectAmount);

    amount.cb(1);
    expect(player.getResource(Resources.ENERGY)).eq(4);
    expect(player.cardsInHand).has.length(1);
  });
});
