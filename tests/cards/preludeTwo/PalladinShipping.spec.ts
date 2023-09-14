import {expect} from 'chai';
import {PalladinShipping} from '../../../src/cards/preludeTwo/PalladinShipping';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {TechnologyDemonstration} from '../../../src/cards/base/TechnologyDemonstration';
import {Harvest} from '../../../src/cards/promo/Harvest';

describe('PalladinShipping', function() {
  let card : PalladinShipping; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new PalladinShipping();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.titanium).eq(5);
  });

  it('Cannot act', function() {
    player.titanium = 1;
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    player.titanium = 2;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(game.getTemperature()).to.eq(-28);
  });

  it('Effect', function() {
    player.playedCards.push(card);
    
    const spaceEvent = new TechnologyDemonstration();
    player2.playCard(spaceEvent);
    expect(player.titanium).to.eq(0);

    player.playCard(spaceEvent);
    expect(player.titanium).to.eq(1);
    
    const nonSpaceEvent = new Harvest();
    player.playCard(nonSpaceEvent);
    expect(player.titanium).to.eq(1);
  });
});
