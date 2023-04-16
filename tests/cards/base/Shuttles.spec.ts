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
    game.setOxygenLevel(5);
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player)).is.false;
  });

  it('Can\'t play if oxygen level too low', function() {
    player.addProduction(Resources.ENERGY, 1);
    game.setOxygenLevel(4);
    expect(card.canPlay(player)).is.false;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(1);

    expect(card.getCardDiscount(player, {tags: [Tags.PLANT]} as IProjectCard)).eq(0);
    expect(card.getCardDiscount(player, {tags: [Tags.SPACE]} as IProjectCard)).eq(2);
  });
});
