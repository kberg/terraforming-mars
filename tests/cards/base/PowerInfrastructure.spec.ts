import {expect} from 'chai';
import {PowerInfrastructure} from '../../../src/cards/base/PowerInfrastructure';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {SelectAmount} from '../../../src/inputs/SelectAmount';

describe('PowerInfrastructure', function() {
  let card : PowerInfrastructure; let player : Player;

  beforeEach(() => {
    card = new PowerInfrastructure();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act', function() {
    card.play(player);
    expect(card.canAct(player)).is.false;
  });

  it('Should act automatically with only 1 energy', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    expect(action).is.undefined;

    expect(player.energy).eq(0);
    expect(player.megaCredits).eq(1);
  });

  it('Should act', function() {
    player.energy = 4;
    expect(card.canAct(player)).is.true;
    const action = card.action(player) as SelectAmount;
    action.cb(1);

    expect(player.energy).eq(3);
    expect(player.megaCredits).eq(1);
  });
});
