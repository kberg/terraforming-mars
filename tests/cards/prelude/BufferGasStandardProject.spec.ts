import {expect} from 'chai';
import {BufferGasStandardProject} from '../../../src/server/cards/prelude/BufferGasStandardProject';
import {runAllActions, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';

describe('BufferGasStandardProject', () => {
  let card: BufferGasStandardProject;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BufferGasStandardProject();
    [game, player] = testGame(1);
  });

  it('Can act', () => {
    player.megaCredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.megaCredits = card.cost;
    player.setTerraformRating(20);

    card.action(player);
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.terraformRating).eq(21);
  });

  it('Test reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
  });
});
