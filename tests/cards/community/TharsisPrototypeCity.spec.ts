import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TharsisPrototypeCity} from '../../../src/cards/community/preludes/TharsisPrototypeCity';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {MiningGuild} from '../../../src/cards/corporation/MiningGuild';
import {CuriosityII} from '../../../src/cards/community/corporations/CuriosityII';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestingUtils} from '../../TestingUtils';

describe('TharsisPrototypeCity', function() {
  let card : TharsisPrototypeCity; let player : Player; let game : Game;

  beforeEach(() => {
    card = new TharsisPrototypeCity();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectSpaceForCity = game.deferredActions.pop()!.execute() as SelectSpace;
    // Manually set for test
    selectSpaceForCity.availableSpaces[0].bonus = [SpaceBonus.STEEL, SpaceBonus.STEEL];

    expect(selectSpaceForCity.cb(selectSpaceForCity.availableSpaces[0])).is.undefined;
    expect(selectSpaceForCity.availableSpaces[0].player).eq(player);
    expect(selectSpaceForCity.availableSpaces[0].tile).is.not.undefined;
    expect(selectSpaceForCity.availableSpaces[0].tile!.tileType).eq(TileType.CITY);

    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.steel).eq(0); // No placement bonus granted
  });

  it('Does not give steel prod bonus for Mining Guild', function() {
    player.corporationCards = [new MiningGuild()];
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectSpaceForCity = game.deferredActions.pop()!.execute() as SelectSpace;
    // Manually set for test
    selectSpaceForCity.availableSpaces[0].bonus = [SpaceBonus.STEEL, SpaceBonus.STEEL];

    selectSpaceForCity.cb(selectSpaceForCity.availableSpaces[0]);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.steel).eq(0); // No placement bonus granted
    expect(player.getProduction(Resources.STEEL)).eq(0); // No placement bonus granted
  });

  it('Triggers corp effect for CuriosityII', function() {
    player.megaCredits = 2;
    player.corporationCards = [new CuriosityII()];
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectSpaceForCity = game.deferredActions.pop()!.execute() as SelectSpace;
    // Manually set for test
    selectSpaceForCity.availableSpaces[0].bonus = [SpaceBonus.STEEL];

    selectSpaceForCity.cb(selectSpaceForCity.availableSpaces[0]);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.steel).eq(0); // No placement bonus granted

    // CuriosityII effect
    expect(game.deferredActions).has.length(1);
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;

    orOptions.options[1].cb(); // Do nothing
    expect(player.cardsInHand).is.empty;
    expect(player.megaCredits).eq(2);

    orOptions.options[0].cb(); // Pay 2 M€ to draw a card
    TestingUtils.runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).eq(0);
  });
});
