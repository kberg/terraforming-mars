import {expect} from 'chai';
import {EcologyResearch} from '../../../src/cards/colonies/EcologyResearch';
import {ICard} from '../../../src/cards/ICard';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Luna} from '../../../src/colonies/Luna';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {ResourceType} from '../../../src/ResourceType';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('EcologyResearch', function() {
  let card : EcologyResearch; let player : Player; let game : Game; let colony1: Luna;

  beforeEach(() => {
    card = new EcologyResearch();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);

    colony1 = new Luna();
    colony1.colonies.push(player.id);
    player.game.colonies.push(colony1);
  });

  it('Should play without targets', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should play with single targets', function() {
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const fish = {resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    player.playedCards.push(tardigrades, fish);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(2);
    const input = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input).is.undefined;
    const input2 = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input2).is.undefined;

    expect(tardigrades.resourceCount).to.eq(2);
    expect(fish.resourceCount).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });

  it('Should play with multiple targets', function() {
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const ants = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    player.playedCards.push(tardigrades, ants);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    // add two microbes to Ants
    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([ants]);

    expect(ants.resourceCount).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
