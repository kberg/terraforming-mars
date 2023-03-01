import {expect} from 'chai';
import {Heather} from '../../../src/cards/base/Heather';
import {Plantation} from '../../../src/cards/base/Plantation';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {RobotPollinators} from '../../../src/cards/promo/RobotPollinators';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('RobotPollinators', function() {
  let card : RobotPollinators; let player : Player;

  beforeEach(() => {
    card = new RobotPollinators();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    player.playedCards.push(new Plantation(), new Heather());

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.plants).eq(2);
  });

  it('Counts wild tags', function() {
    player.playedCards.push(new Plantation(), new Heather(), new ResearchCoordination());

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.plants).eq(3);
  });
});
