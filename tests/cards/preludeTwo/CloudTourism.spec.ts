import {expect} from 'chai';
import {CloudTourism} from '../../../src/cards/preludeTwo/CloudTourism';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {SisterPlanetSupport} from '../../../src/cards/venusNext/SisterPlanetSupport';
import {EarthOffice} from '../../../src/cards/base/EarthOffice';
import {Resources} from '../../../src/Resources';

describe('CloudTourism', function() {
  let card : CloudTourism; let player : Player;

  beforeEach(() => {
    card = new CloudTourism();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    player.playedCards.push(new EarthOffice(), new SisterPlanetSupport());
    player.playCard(card);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
  });

  it('Takes action', function() {
    card.action(player);
    expect(card.resourceCount).eq(1);
  });

  it('Gives VP', function() {
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(0);

    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);
  });
});
