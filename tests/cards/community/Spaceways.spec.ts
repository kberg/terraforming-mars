import {expect} from 'chai';
import {TechnologyDemonstration} from '../../../src/cards/base/TechnologyDemonstration';
import {Spaceways} from '../../../src/cards/community/corporations/Spaceways';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Spaceways', function() {
  let card : Spaceways; let player : Player; let player2 : Player;

  beforeEach(() => {
    card = new Spaceways();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);

    card.play(player);
    player.corporationCards = [card];
  });

  it('Gains 2 M€ if another player plays a Space Event', function() {
    const techDemo = new TechnologyDemonstration();

    player2.playCard(techDemo);
    expect(player.megaCredits).to.eq(2);
  });

  it('Gains 1 M€ production after playing a Space Event', function() {
    const techDemo = new TechnologyDemonstration();

    player.playCard(techDemo);
    expect(player.megaCredits).to.eq(2);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
