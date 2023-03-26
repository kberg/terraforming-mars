import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {ButterflyEffect} from '../../../src/cards/ares/ButterflyEffect';
import {expect} from 'chai';
import {ARES_OPTIONS_WITH_HAZARDS} from '../../ares/AresTestHelper';
import {ShiftAresGlobalParameters} from '../../../src/inputs/ShiftAresGlobalParameters';
import {TestPlayers} from '../../TestPlayers';
import {Phase} from '../../../src/Phase';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {AresHandler} from '../../../src/ares/AresHandler';
import {HAZARD_CONSTRAINTS} from '../../../src/ares/IAresData';

describe('ButterflyEffect', function() {
  let card: ButterflyEffect; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new ButterflyEffect();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, ARES_OPTIONS_WITH_HAZARDS);
  });

  it('play', function() {
    const priorTerraformingRating = player.getTerraformRating();
    card.play(player);
    expect(player.getTerraformRating()).eq(priorTerraformingRating + 1);

    const originalHazardData = game.aresData!.hazardData;
    expect(originalHazardData.erosionOceanCount.threshold).eq(3);
    expect(originalHazardData.removeDustStormsOceanCount.threshold).eq(6);
    expect(originalHazardData.severeErosionTemperature.threshold).eq(-4);
    expect(originalHazardData.severeDustStormOxygen.threshold).eq(5);

    const input = game.deferredActions.peek()!.execute() as ShiftAresGlobalParameters;
    input.cb(
      {
        lowOceanDelta: -1,
        highOceanDelta: 1,
        temperatureDelta: -1,
        oxygenDelta: 1,
      },
    );

    const revisedHazardData = game.aresData!.hazardData;
    expect(revisedHazardData.erosionOceanCount.threshold).eq(2);
    expect(revisedHazardData.removeDustStormsOceanCount.threshold).eq(7);
    expect(revisedHazardData.severeErosionTemperature.threshold).eq(-6);
    expect(revisedHazardData.severeDustStormOxygen.threshold).eq(6);
  });

  it('play', function() {
    AresHandler.ifAres(game, (aresData) => {
      for (const constraint of HAZARD_CONSTRAINTS) {
        aresData.hazardData[constraint].available = false;
      }
    });

    const priorTerraformingRating = player.getTerraformRating();
    card.play(player);
    expect(player.getTerraformRating()).eq(priorTerraformingRating + 1);
    expect(game.deferredActions).has.length(0);
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST;
    expect(player.canPlay(card)).is.true;
  });
});
