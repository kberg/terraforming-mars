import {expect} from 'chai';
import {ExtremeColdFungus} from '../../../src/cards/base/ExtremeColdFungus';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {ResourceType} from '../../../src/ResourceType';
import {TestPlayers} from '../../TestPlayers';

describe('ExtremeColdFungus', () => {
  let card : ExtremeColdFungus; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new ExtremeColdFungus();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot play', () => {
    (game as any).temperature = -8;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    (game as any).temperature = -12;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - single target', () => {
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    player.playedCards.push(tardigrades);

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    expect(action!.options).has.lengthOf(2);

    action!.options[0].cb();
    expect(player.getResourcesOnCard(tardigrades)).eq(2);

    action!.options[1].cb();
    expect(player.plants).eq(1);
  });

  it('Should act - multiple targets', () => {
    const tardigrades = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    const ants = {resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    player.playedCards.push(tardigrades, ants);

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    expect(action!.options).has.lengthOf(2);

    action!.options[0].cb([tardigrades]);
    expect(player.getResourcesOnCard(tardigrades)).eq(2);

    action!.options[0].cb([ants]);
    expect(player.getResourcesOnCard(ants)).eq(2);
  });
});
