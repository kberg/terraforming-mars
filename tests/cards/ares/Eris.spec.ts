import {expect} from 'chai';
import {Eris} from '../../../src/cards/ares/Eris';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {_AresHazardPlacement} from '../../../src/ares/AresHazards';
import {ARES_OPTIONS_WITH_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';
import {Phase} from '../../../src/Phase';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';

describe('Eris', function() {
  let card : Eris; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new Eris();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    game = Game.newInstance('foobar', [player, player2], player, ARES_OPTIONS_WITH_HAZARDS);

    card.play();
    player.corporationCards = [card];
  });

  it('Starts with 1 Ares card', function() {
    card.initialAction(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Can act', function() {
    const action = card.action(player) as OrOptions;
    const initialHazardsCount = _AresHazardPlacement.getHazardsCount(game);
    const initialTR = player.getTerraformRating();

    // Place a hazard tile
    action.options[0].cb();
    expect(game.deferredActions).has.lengthOf(1);
    const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
    placeHazard.cb(placeHazard.availableSpaces[0]);
    expect(_AresHazardPlacement.getHazardsCount(game)).eq(initialHazardsCount + 1);

    // Remove a hazard tile to gain 1 TR
    const removableHazards = action.options[1].cb() as SelectSpace;
    removableHazards.cb(removableHazards.availableSpaces[0]);
    expect(_AresHazardPlacement.getHazardsCount(game)).eq(initialHazardsCount);
    expect(player.getTerraformRating()).eq(initialTR + 1);
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    const action = card.action(player);
    expect(action).is.undefined;
    const initialHazardsCount = _AresHazardPlacement.getHazardsCount(game);

    // Option to place a hazard tile is auto selected as player cannot afford Reds
    expect(game.deferredActions).has.lengthOf(1);
    const placeHazard = game.deferredActions.pop()!.execute() as SelectSpace;
    placeHazard.cb(placeHazard.availableSpaces[0]);
    expect(_AresHazardPlacement.getHazardsCount(game)).eq(initialHazardsCount + 1);
  });
});
