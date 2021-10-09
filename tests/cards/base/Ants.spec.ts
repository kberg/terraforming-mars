import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {ProtectedHabitats} from '../../../src/cards/base/ProtectedHabitats';
import {ICard} from '../../../src/cards/ICard';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {ResourceType} from '../../../src/ResourceType';
import {TestPlayers} from '../../TestPlayers';

describe('Ants', function() {
  let card : Ants; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new Ants();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play without oxygen', function() {
    (game as any).oxygenLevel = 3;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 4;
    expect(card.canPlay(player)).is.true;

    card.play();
    card.resourceCount += 5;
    expect(card.getVictoryPoints()).eq(2);
  });

  it('Should action with multiple valid targets', function() {
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const nitriteReducingBacteria = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;

    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;

    player2.playedCards.push(tardigrades, nitriteReducingBacteria);
    tardigrades.resourceCount!++;
    nitriteReducingBacteria.resourceCount!++;

    expect(card.canAct(player)).is.true;

    card.action(player);
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(selectCard.cards).has.lengthOf(2);
    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.pop()!.execute(); // Add microbe to ants

    expect(card.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(0);
  });

  it('Respects protected habitats', function() {
    const protectedHabitats = new ProtectedHabitats();
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;

    player.playedCards.push(card);
    player2.playedCards.push(tardigrades);
    tardigrades.resourceCount! += 2;
    expect(card.canAct(player)).is.true;

    player2.playedCards.push(protectedHabitats);
    expect(card.canAct(player)).is.not.true;
  });

  it('Only microbes are available to steal', function() {
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const fish = {resourceType: ResourceType.ANIMAL, resourceCount: 0} as IProjectCard;
    const securityFleet = {resourceType: ResourceType.FIGHTER, resourceCount: 0} as IProjectCard;

    player.playedCards.push(card);
    player2.playedCards.push(tardigrades, fish, securityFleet);
    player2.addResourceTo(tardigrades);
    player2.addResourceTo(fish);
    player2.addResourceTo(securityFleet);

    card.action(player);
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(selectCard).is.undefined; // Only one option: Tardigrades
    game.deferredActions.pop()!.execute(); // Add microbe to ants

    expect(card.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(0);
  });
});
