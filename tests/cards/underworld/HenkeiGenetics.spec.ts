import {expect} from 'chai';
import {HenkeiGenetics} from '../../../src/server/cards/underworld/HenkeiGenetics';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';

describe('HenkeiGenetics', () => {
  let card: HenkeiGenetics;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new HenkeiGenetics();
    [game, player] = testGame(1);
  });

  it('Should play', () => {
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.underworldData.corruption).eq(1);
  });

  it('canAct', () => {
    player.corporations.push(card);

    expect(card.canAct(player)).is.false;

    player.underworldData.corruption = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.corporations.push(card);
    player.underworldData.corruption = 1;

    cast(card.action(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags).contains(Tag.MICROBE);
    expect(player.underworldData.corruption).eq(0);
  });

  it('onCardPlayed', () => {
    player.corporations.push(card);
    const tardigrades = new Tardigrades();
    player.playCard(tardigrades);
    runAllActions(game);
    expect(tardigrades.resourceCount).eq(2);
  });
});
