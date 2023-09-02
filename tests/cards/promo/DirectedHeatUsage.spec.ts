import {expect} from 'chai';
import {DirectedHeatUsage} from '../../../src/cards/promo/DirectedHeatUsage';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {StormCraftIncorporated} from '../../../src/cards/colonies/StormCraftIncorporated';
import {OrOptions} from '../../../src/inputs/OrOptions';

describe('DirectedHeatUsage', function() {
  let card : DirectedHeatUsage; let player : Player;

  beforeEach(() => {
    card = new DirectedHeatUsage();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('canAct', function() {
    expect(card.canAct(player)).eq(false);

    player.heat = 3;
    expect(card.canAct(player)).eq(true);

    player.heat = 1;
    expect(card.canAct(player)).eq(false);
    
    const stormcraft = new StormCraftIncorporated();
    stormcraft.resourceCount = 1;
    player.corporationCards.push(stormcraft);
    expect(card.canAct(player)).eq(true);
  });

  it('Takes action', function() {
    player.heat = 3;
    const orOptions = card.action(player) as OrOptions;

    // Gain 4 M€
    orOptions.options[0].cb();
    expect(player.megaCredits).eq(4);
    expect(player.heat).eq(0);

    // Gain 2 plants
    orOptions.options[1].cb();
    expect(player.plants).eq(2);
  });
});
