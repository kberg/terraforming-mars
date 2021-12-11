import {expect} from 'chai';
import {CEOsFavoriteProject} from '../../../src/cards/base/CEOsFavoriteProject';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {SelfReplicatingRobots} from '../../../src/cards/promo/SelfReplicatingRobots';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {ResourceType} from '../../../src/ResourceType';
import {TestPlayers} from '../../TestPlayers';

describe('CEOsFavoriteProject', function() {
  let card : CEOsFavoriteProject; let player : Player;

  beforeEach(() => {
    card = new CEOsFavoriteProject();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const searchForLife = {resourceType: ResourceType.SCIENCE, resourceCount: 1} as IProjectCard;
    const securityFleet = {resourceType: ResourceType.FIGHTER, resourceCount: 1} as IProjectCard;
    const decomposers = {resourceType: ResourceType.MICROBE, resourceCount: 1} as IProjectCard;
    const birds = {resourceType: ResourceType.ANIMAL, resourceCount: 1} as IProjectCard;

    player.playedCards.push(searchForLife, securityFleet, decomposers, birds);

    const action = card.play(player);
    expect(action).instanceOf(SelectCard);

    action.cb([searchForLife]);
    expect(player.getResourcesOnCard(searchForLife)).eq(2);
    action.cb([birds]);
    expect(player.getResourcesOnCard(birds)).eq(2);
    action.cb([decomposers]);
    expect(player.getResourcesOnCard(decomposers)).eq(2);
    action.cb([securityFleet]);
    expect(player.getResourcesOnCard(securityFleet)).eq(2);
  });

  it('Can play on SelfReplicatingRobots cards', function() {
    const srr = new SelfReplicatingRobots();
    const srrTarget = {} as IProjectCard;
    player.playedCards.push(srr);
    srr.targetCards.push({card: srrTarget, resourceCount: 0});

    const action = card.play(player);
    expect(action).instanceOf(SelectCard);
    action.cb([srrTarget]);
    expect(srr.targetCards[0].resourceCount).eq(1);
  });
});
