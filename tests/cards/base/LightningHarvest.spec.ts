import {expect} from 'chai';
import {LightningHarvest} from '../../../src/cards/base/LightningHarvest';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';

describe('LightningHarvest', function() {
  let card : LightningHarvest; let player : TestPlayer;

  beforeEach(() => {
    card = new LightningHarvest();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push({tags: Array(3).fill(Tags.SCIENCE)} as IProjectCard);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(1);
  });
});
