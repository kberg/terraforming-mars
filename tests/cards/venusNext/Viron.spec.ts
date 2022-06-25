import {expect} from 'chai';
import {RestrictedArea} from '../../../src/cards/base/RestrictedArea';
import {ICard} from '../../../src/cards/ICard';
import {Factorum} from '../../../src/cards/promo/Factorum';
import {Viron} from '../../../src/cards/venusNext/Viron';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Viron', function() {
  let card : Viron; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new Viron();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should act', function() {
    expect(card.play()).is.undefined;

    player.corporationCards = [card];
    const restrictedArea = new RestrictedArea();
    player.playedCards.push(restrictedArea);
    player.setActionsThisGeneration(restrictedArea.name);
    expect(card.canAct(player)).is.false;

    player.megaCredits = 2;
    expect(card.canAct(player)).is.true;

    const action = card.action(player)  as SelectCard<ICard>;
    expect(action.cards).has.length(1);

    action.cb([restrictedArea]);
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.length(1);
  });

  it('Can reuse corp action', function() {
    const factorum = new Factorum();
    player.corporationCards = [card, factorum];

    expect(card.play()).is.undefined;

    player.setActionsThisGeneration(factorum.name);
    expect(card.canAct(player)).is.true;

    const action = card.action(player) as SelectCard<ICard>;
    expect(action.cards).has.length(1);
  });
});
