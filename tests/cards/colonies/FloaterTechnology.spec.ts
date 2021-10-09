import {expect} from 'chai';
import {FloaterTechnology} from '../../../src/cards/colonies/FloaterTechnology';
import {ICard} from '../../../src/cards/ICard';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {ResourceType} from '../../../src/ResourceType';
import {TestPlayers} from '../../TestPlayers';

describe('FloaterTechnology', function() {
  let card : FloaterTechnology; let player : Player; let game : Game;

  beforeEach(() => {
    card = new FloaterTechnology();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play', function() {
    const result = card.play();
    expect(result).is.undefined;
  });

  it('Cannot act without targets', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Acts automatically with single targets', function() {
    const dirigibles = {resourceType: ResourceType.FLOATER, resourceCount: 0} as IProjectCard;
    player.playedCards.push(dirigibles);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(dirigibles.resourceCount).eq(1);
  });

  it('Should act with multiple targets', function() {
    const dirigibles = {resourceType: ResourceType.FLOATER, resourceCount: 0} as IProjectCard;
    const floatingHabs = {resourceType: ResourceType.FLOATER, resourceCount: 0} as IProjectCard;
    player.playedCards.push(dirigibles, floatingHabs);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).eq(1);
    expect(dirigibles.resourceCount).eq(0);
  });
});
