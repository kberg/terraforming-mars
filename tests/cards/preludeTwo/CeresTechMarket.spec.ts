import {expect} from 'chai';
import {CeresTechMarket} from '../../../src/cards/preludeTwo/CeresTechMarket';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {Mine} from '../../../src/cards/base/Mine';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {SelectAmount} from '../../../src/inputs/SelectAmount';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestingUtils} from '../../TestingUtils';

describe('CeresTechMarket', function() {
  let card : CeresTechMarket; let player : Player; let game : Game;

  beforeEach(() => {
    card = new CeresTechMarket();
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player], player, gameOptions);
  });

  it('Play', function() {
    const colony1 = new Luna();
    const colony2 = new Triton();

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);
    game.colonies.push(colony1, colony2);

    card.play(player);
    expect(player.megaCredits).eq(4);
  });

  it('canAct', function() {
    expect(card.canAct(player)).is.false;

    player.cardsInHand.push(new Mine());
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    player.cardsInHand.push(new Mine(), new SearchForLife());

    const selectAmount = card.action(player) as SelectAmount;
    selectAmount.cb(1);

    const discardCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(discardCard).instanceOf(SelectCard);

    discardCard.cb([discardCard.cards[0]]);
    expect(player.cardsInHand).has.length(1);
    game.deferredActions.runNext();
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(2);
  });

  it('Gives VP', function() {
    expect(card.getVictoryPoints()).eq(1);
  });
});
