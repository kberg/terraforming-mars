import {expect} from 'chai';
import {MirandaResort} from '../../../src/cards/base/MirandaResort';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';

describe('MirandaResort', function() {
  it('Should play', function() {
    const card = new MirandaResort();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    player.playedCards.push({tags: [Tags.EARTH]} as IProjectCard);

    const action = card.play(player);
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
  });
});
