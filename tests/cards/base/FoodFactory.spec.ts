import {expect} from 'chai';
import {FoodFactory} from '../../../src/cards/base/FoodFactory';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('FoodFactory', function() {
  let card : FoodFactory; let player : TestPlayer;

  beforeEach(() => {
    card = new FoodFactory();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.PLANTS, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(4);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(1);
  });
});
