import {expect} from 'chai';
import {ImportedNitrogen} from '../../../src/cards/base/ImportedNitrogen';
import {ICard} from '../../../src/cards/ICard';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {ResourceType} from '../../../src/ResourceType';
import {TestPlayers} from '../../TestPlayers';

describe('ImportedNitrogen', function() {
  let card : ImportedNitrogen; let player : Player; let game : Game;

  beforeEach(() => {
    card = new ImportedNitrogen();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play without animals and microbes', function() {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with only animals', function() {
    const pets = {resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    const birds = {resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    player.playedCards.push(pets, birds);
    card.play(player);

    const addMicrobes = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(addMicrobes).is.undefined;

    const addAnimals = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addAnimals.cb([pets]);
    expect(player.getResourcesOnCard(pets)).to.eq(2);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with only microbes', function() {
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const ants = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    player.playedCards.push(tardigrades, ants);
    card.play(player);

    const addMicrobes = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addMicrobes.cb([tardigrades]);
    expect(player.getResourcesOnCard(tardigrades)).to.eq(3);

    const addAnimals = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(addAnimals).is.undefined;

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });

  it('Should play with animals and microbes', function() {
    const pets = {resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    const birds = {resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const ants = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    player.playedCards.push(pets, tardigrades, birds, ants);
    card.play(player);

    const addMicrobes = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addMicrobes.cb([tardigrades]);
    expect(player.getResourcesOnCard(tardigrades)).to.eq(3);

    const addAnimals = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    addAnimals.cb([pets]);
    expect(player.getResourcesOnCard(pets)).to.eq(2);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player.plants).to.eq(4);
  });
});
