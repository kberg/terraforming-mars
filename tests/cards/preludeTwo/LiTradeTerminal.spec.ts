import {expect} from 'chai';
import {LiTradeTerminal} from '../../../src/cards/preludeTwo/LiTradeTerminal';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestingUtils} from '../../TestingUtils';
import {ICard} from '../../../src/cards/ICard';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';

describe('LiTradeTerminal', function() {
  let card : LiTradeTerminal; let player : Player;

  beforeEach(() => {
    card = new LiTradeTerminal();
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    Game.newInstance('foobar', [player], player, gameOptions);
  });

  it('Play - no targets', function() {
    const play = card.play(player);
    expect(player.colonyTradeOffset).eq(2);
    expect(play).is.undefined;
  });

  it('Play - less than 3 targets', function() {
    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    const selectCard = card.play(player) as SelectCard<ICard>;

    selectCard.cb([searchForLife]);
    expect(searchForLife.resourceCount).eq(1);
  });

  it('Play - 3 or more targets', function() {
    const searchForLife = new SearchForLife();
    const tardigrades = new Tardigrades();
    const aerialMappers = new AerialMappers();
    player.playedCards.push(searchForLife, tardigrades, aerialMappers);
    const selectCard = card.play(player) as SelectCard<ICard>;

    selectCard.cb([searchForLife, tardigrades, aerialMappers]);
    expect(searchForLife.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(1);
    expect(aerialMappers.resourceCount).eq(1);
  });

  it('Gives VP', function() {
    expect(card.getVictoryPoints()).eq(2);
  });
});
