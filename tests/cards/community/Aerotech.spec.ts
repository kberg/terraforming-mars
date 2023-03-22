import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';
import {InventionContest} from '../../../src/cards/base/InventionContest';
import {Aerotech} from '../../../src/cards/community/corporations/Aerotech';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {DrawCards} from '../../../src/deferredActions/DrawCards';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Aerotech', function() {
  let card : Aerotech; let player : Player; let game: Game;

  beforeEach(() => {
    card = new Aerotech();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);

    card.play();
    player.corporationCards = [card];
  });

  it('Effect works during research phase', function() {
    player.titanium = 0;
    game.phase = Phase.RESEARCH;

    const dealtCards = [
      game.dealer.dealCard(game, true),
      game.dealer.dealCard(game, true),
      game.dealer.dealCard(game, true),
      game.dealer.dealCard(game, true),
    ]

    const selectCard = DrawCards.choose(player, dealtCards, {keepMax: 4, paying: true});
    selectCard.cb([dealtCards[0], dealtCards[2]]);
    game.deferredActions.runAll(() => {});
    expect(player.titanium).to.eq(2);
  });

  it('Effect does not proc during action phase', function() {
    player.titanium = 0;
    game.phase = Phase.ACTION;

    const inventionContest = new InventionContest();
    inventionContest.play(player);

    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runAll(() => {});
    expect(player.titanium).to.eq(0);

    const businessNetwork = new BusinessNetwork();
    const action = businessNetwork.action(player) as SelectCard<IProjectCard>;
    action.cb([]);
    expect(player.titanium).to.eq(0);
  });
});
