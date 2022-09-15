import {expect} from 'chai';
import {HiTechLab} from '../../../src/cards/promo/HiTechLab';
import {Game} from '../../../src/Game';
import {SelectAmount} from '../../../src/inputs/SelectAmount';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('HiTechLab', function() {
  let card : HiTechLab; let player : Player;

  beforeEach(() => {
    card = new HiTechLab();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Can\'t act if no energy resources available', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.addResource(Resources.ENERGY, 5);
    expect(card.canAct(player)).is.true;

    const amount = card.action(player) as SelectAmount;
    expect(amount).instanceOf(SelectAmount);

    amount!.cb(3);
    expect(player.getResource(Resources.ENERGY)).eq(2);
  });

  it('If only 1 energy is spent, draw the card directly', function() {
    player.addResource(Resources.ENERGY, 1);
    expect(card.canAct(player)).is.true;

    const amount = card.action(player) as SelectAmount;
    expect(amount).instanceOf(SelectAmount);

    amount.cb(1);
    expect(player.getResource(Resources.ENERGY)).eq(0);
    expect(player.cardsInHand).has.length(1);
  });

  it('Should give victory points', function() {
    card.play();
    expect(card.getVictoryPoints()).eq(1);
  });
});
