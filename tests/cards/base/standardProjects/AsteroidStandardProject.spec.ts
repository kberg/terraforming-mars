import {expect} from 'chai';
import {AsteroidStandardProject} from '../../../../src/server/cards/base/standardProjects/AsteroidStandardProject';
import {cast, runAllActions, setTemperature, testRedsCosts} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {IGame} from '../../../../src/server/IGame';
import {MAX_TEMPERATURE} from '../../../../src/common/constants';
import {testGame} from '../../../TestGame';

describe('AsteroidStandardProject', () => {
  let card: AsteroidStandardProject;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AsteroidStandardProject();
    [game, player] = testGame(2);
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
    expect(game.getTemperature()).eq(-30);

    card.action(player);
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(player.terraformRating).eq(21);
    expect(game.getTemperature()).eq(-28);
  });

  it('Paying when the global parameter is at its goal is a valid stall action', () => {
    player.megaCredits = 14;
    expect(card.canAct(player)).eq(true);

    setTemperature(game, MAX_TEMPERATURE);

    expect(player.terraformRating).eq(20);
    expect(card.canAct(player)).eq(true);

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(game.getTemperature()).eq(MAX_TEMPERATURE);
    expect(player.terraformRating).eq(20);
    expect(player.megaCredits).eq(0);
  });

  it('Test reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    setTemperature(game, 8);
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});
