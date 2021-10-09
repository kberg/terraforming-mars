import {expect} from 'chai';
import {SolarProbe} from '../../../src/cards/colonies/SolarProbe';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('SolarProbe', function() {
  it('Should play', function() {
    const card = new SolarProbe();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);

    player.playedCards.push({tags: [Tags.SCIENCE, Tags.SCIENCE]} as IProjectCard);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(1);
  });
});
