import {expect} from 'chai';
import {Recyclon} from '../../../src/cards/promo/Recyclon';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Mine} from '../../../src/cards/base/Mine';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TitaniumMine} from '../../../src/cards/base/TitaniumMine';
import {SFMemorial} from '../../../src/cards/prelude/SFMemorial';
import {MiningGuild} from '../../../src/cards/corporation/MiningGuild';
import {Merger} from '../../../src/cards/promo/Merger';
import {CheungShingMARS} from '../../../src/cards/prelude/CheungShingMARS';

describe('Recyclon', function() {
  let card : Recyclon; let player : Player; let game : Game;

  beforeEach(() => {
    card = new Recyclon();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(card.resourceCount).eq(1);
  });

  it('Works with played project cards', function() {
    player.corporationCards.push(card);

    player.playCard(new Mine());
    expect(card.resourceCount).eq(1);

    player.playCard(new TitaniumMine());
    expect(card.resourceCount).eq(2);

    player.playCard(new SFMemorial());
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    expect(orOptions).instanceOf(OrOptions);

    // Add a microbe
    orOptions.options[1].cb();
    expect(card.resourceCount).eq(3);

    // Remove 2 microbes to raise plant production 1 step
    orOptions.options[0].cb();
    expect(card.resourceCount).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
  });

  it('Works with merged corporation with single building tag', function() {
    player.corporationCards.push(card);
    card.play(player);
    expect(card.resourceCount).eq(1);

    Merger.playSecondCorporationCard(player, new CheungShingMARS());
    game.deferredActions.runAll(() => {});
    expect(card.resourceCount).eq(2);

    Merger.playSecondCorporationCard(player, new CheungShingMARS());
    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    expect(orOptions).instanceOf(OrOptions);

    // Add a microbe
    orOptions.options[1].cb();
    expect(card.resourceCount).eq(3);

    // Remove 2 microbes to raise plant production 1 step
    orOptions.options[0].cb();
    expect(card.resourceCount).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
  });

  it('Works with merged Mining Guild: 0 resources on card', function() {
    player.corporationCards.push(card);
    card.resourceCount = 0;

    Merger.playSecondCorporationCard(player, new MiningGuild());
    game.deferredActions.runAll(() => {});
    expect(card.resourceCount).eq(2);
  });

  it('Works with merged Mining Guild: 1 resource on card', function() {
    player.corporationCards.push(card);
    card.play(player);
    expect(card.resourceCount).eq(1);

    Merger.playSecondCorporationCard(player, new MiningGuild());

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    expect(card.resourceCount).eq(2);
    expect(orOptions).instanceOf(OrOptions);

    // Add a microbe
    orOptions.options[1].cb();
    expect(card.resourceCount).eq(3);

    // Remove 2 microbes to raise plant production 1 step
    orOptions.options[0].cb();
    expect(card.resourceCount).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
  });

  it('Works with merged Mining Guild: 2 resources on card', function() {
    player.corporationCards.push(card);
    card.resourceCount = 2;

    Merger.playSecondCorporationCard(player, new MiningGuild());

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    expect(orOptions).instanceOf(OrOptions);

    // Add 2 microbes
    orOptions.options[1].cb();
    expect(card.resourceCount).eq(4);

    // Remove 2 microbes to raise plant production 1 step, then add 1 microbe
    orOptions.options[0].cb();
    expect(card.resourceCount).eq(3);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
  });

  it('Works with merged Mining Guild: 4 or more resources on card', function() {
    player.corporationCards.push(card);
    card.resourceCount = 4;

    Merger.playSecondCorporationCard(player, new MiningGuild());

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    expect(orOptions).instanceOf(OrOptions);

    // Add 2 microbes
    orOptions.options[2].cb();
    expect(card.resourceCount).eq(6);

    // Remove 2 microbes to raise plant production 1 step, then add 1 microbe
    orOptions.options[1].cb();
    expect(card.resourceCount).eq(5);
    expect(player.getProduction(Resources.PLANTS)).eq(1);

    // Remove 4 microbes to raise plant production 2 steps
    orOptions.options[0].cb();
    expect(card.resourceCount).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(3);
  });
});
