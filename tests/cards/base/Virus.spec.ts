import {expect} from 'chai';
import {Virus} from '../../../src/cards/base/Virus';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {ResourceType} from '../../../src/ResourceType';
import {TestPlayers} from '../../TestPlayers';

describe('Virus', function() {
  let card : Virus; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new Virus();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    const birds = {resourceType: ResourceType.ANIMAL, resourceCount: 1} as IProjectCard;
    const predators = {resourceType: ResourceType.ANIMAL, resourceCount: 1} as IProjectCard;
    player.playedCards.push(birds, predators);
    player.plants = 5;

    const orOptions = card.play(player2) as OrOptions;
    expect(orOptions).instanceOf(OrOptions);

    orOptions.options[0].cb([player.playedCards[0]]);
    expect(player.getResourcesOnCard(birds)).eq(0);

    orOptions.options[1].cb();
    expect(player.plants).eq(0);
  });

  it('Can play when no other player has resources', function() {
    player.plants = 5;
    expect(card.play(player)).is.undefined;
    expect(player.plants).eq(5);
  });

  it('Works in solo mode', function() {
    game = Game.newInstance('foobar', [player], player);
    expect(card.canPlay(player)).is.true;
    expect(card.play(player)).is.undefined;
    expect(game.someoneHasRemovedOtherPlayersPlants).is.true;
  });
});
