import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/cards/base/AdvancedEcosystems';
import {TestPlayer} from '../../TestPlayer';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';

describe('AdvancedEcosystems', function() {
  let card : AdvancedEcosystems; let player : TestPlayer;

  beforeEach(() => {
    card = new AdvancedEcosystems();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    player.playedCards.push({tags: [Tags.PLANT]} as IProjectCard, {tags: [Tags.WILDCARD]} as IProjectCard);
  });

  it('Can\'t play if tag requirements is unmet', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.not.true;

    player.playedCards.push({tags: [Tags.MICROBE]} as IProjectCard);
    expect(card.canPlay(player)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).eq(3);
  });

  it('Can play with two wildcards', function() {
    player.playedCards.push(new ResearchCoordination());
    expect(card.canPlay(player)).is.true;
  });
});
