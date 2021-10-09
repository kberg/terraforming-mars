import {expect} from 'chai';
import {GalileanWaystation} from '../../../src/cards/colonies/GalileanWaystation';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('GalileanWaystation', function() {
  let card : GalileanWaystation; let player : Player; let player2: Player;

  beforeEach(() => {
    card = new GalileanWaystation();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player.playedCards.push({tags: [Tags.JOVIAN]} as IProjectCard);
    player2.playedCards.push({tags: [Tags.JOVIAN]} as IProjectCard);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
  });

  it('Corectly counts wildtags', function() {
    player.playedCards.push({tags: [Tags.JOVIAN, Tags.WILDCARD]} as IProjectCard); // Should include this wild tag
    player2.playedCards.push({tags: [Tags.JOVIAN, Tags.WILDCARD]} as IProjectCard); // Should NOT include this wild tag

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);
  });
});
