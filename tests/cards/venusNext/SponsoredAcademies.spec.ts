import {expect} from 'chai';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {HousePrinting} from '../../../src/cards/prelude/HousePrinting';
import {SponsoredAcademies} from '../../../src/cards/venusNext/SponsoredAcademies';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayers} from '../../TestPlayers';
import {DiscardCards} from '../../../src/deferredActions/DiscardCards';
import {DrawCards} from '../../../src/deferredActions/DrawCards';
import {MarsUniversity} from '../../../src/cards/base/MarsUniversity';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('SponsoredAcademies', function() {
  let card: SponsoredAcademies;
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let tardigrades: Tardigrades;
  let housePrinting: HousePrinting;

  beforeEach(() => {
    card = new SponsoredAcademies();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.cardsInHand.push(card);
    tardigrades = new Tardigrades();
    housePrinting = new HousePrinting();
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.not.true;
    player.cardsInHand.push(tardigrades, housePrinting);
    expect(card.canPlay(player)).is.true;

    player.playCard(card);
    const discardCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(discardCard).instanceOf(SelectCard);

    // No SponsoredAcademies itself suggested to discard
    expect(discardCard.cards.filter((c) => c.name === card.name)).has.lengthOf(0);

    discardCard.cb([tardigrades]);
    game.deferredActions.runAll(() => {}); // Draw cards
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player2.cardsInHand).has.lengthOf(1);
  });

  it('triggers in right order', function() {
    const player3 = TestPlayers.BLACK.newPlayer();
    const player4 = TestPlayers.GREEN.newPlayer();
    const game = Game.newInstance('foobar', [player, player2, player3, player4], player);

    player.cardsInHand.push(card, new HousePrinting(), new Tardigrades());
    player.playCard(card);

    // If something here doesn't work, it might be linked to the DeferredActionsQueue,
    expect((game.deferredActions.pop() as DiscardCards).title).eq('Select 1 card to discard');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('blue');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('red');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('black');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('green');
  });

  it('Takes priority over Mars U', () => {
    player.playedCards.push(new MarsUniversity());

    player.cardsInHand.push(tardigrades, housePrinting);
    player.playCard(card);

    // Settle Sponsored Academies effect.
    TestingUtils.runAllActions(game);
    const discardCard = player.popWaitingFor() as SelectCard<IProjectCard>;

    expect(player.cardsInHand).has.length(2);

    discardCard.cb([tardigrades]);
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).has.length(4);
    expect(player.cardsInHand).does.not.contain(tardigrades);

    TestingUtils.runAllActions(game);

    // Mars U effect starts now.
    const orOptions = player.popWaitingFor() as OrOptions;
    const selectCard =  orOptions.options[0] as SelectCard<IProjectCard>;

    selectCard.cb([housePrinting]);
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).does.not.contain(housePrinting);
    expect(player.cardsInHand).has.length(4);
  });
});
