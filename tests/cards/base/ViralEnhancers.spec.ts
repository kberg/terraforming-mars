import {expect} from 'chai';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {ResourceType} from '../../../src/ResourceType';
import {TestPlayers} from '../../TestPlayers';

describe('ViralEnhancers', function() {
  let card : ViralEnhancers; let player : Player; let game : Game;

  beforeEach(() => {
    card = new ViralEnhancers();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play();

    const ants = {tags: [Tags.ANIMAL], resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const birds = {tags: [Tags.ANIMAL], resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    const moss = {tags: [Tags.PLANT]} as IProjectCard;
    player.playedCards.push(ants, birds, moss);

    card.onCardPlayed(player, birds);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player.getResourcesOnCard(birds)).to.eq(1);
    orOptions.options[1].cb();
    expect(player.plants).to.eq(1);

    card.onCardPlayed(player, ants);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions2.options[0].cb();
    expect(player.getResourcesOnCard(ants)).to.eq(1);
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(2);
  });

  it('Should play for each tag', function() {
    card.play();

    const ecologicalZone = {tags: [Tags.PLANT, Tags.ANIMAL], resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    card.onCardPlayed(player, ecologicalZone);
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player.getResourcesOnCard(ecologicalZone)).to.eq(1);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(1);
    expect(game.deferredActions).has.lengthOf(0);
  });
});
