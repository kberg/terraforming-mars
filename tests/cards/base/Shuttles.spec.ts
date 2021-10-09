import {expect} from 'chai';
import {Shuttles} from '../../../src/cards/base/Shuttles';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';

describe('Shuttles', function() {
  let card : Shuttles; let player : TestPlayer; let game : Game;

  beforeEach(() => {
    card = new Shuttles();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play without energy production', function() {
    (game as any).oxygenLevel = 5;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play if oxygen level too low', function() {
    player.addProduction(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 4;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 5;
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);

    expect(card.getCardDiscount(player, {tags: [Tags.PLANT]} as IProjectCard)).to.eq(0);
    expect(card.getCardDiscount(player, {tags: [Tags.SPACE]} as IProjectCard)).to.eq(2);
  });
});
