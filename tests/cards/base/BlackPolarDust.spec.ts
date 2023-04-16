import {expect} from 'chai';
import {BlackPolarDust} from '../../../src/cards/base/BlackPolarDust';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Resources} from '../../../src/Resources';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Phase} from '../../../src/Phase';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';

describe('BlackPolarDust', function() {
  let card : BlackPolarDust; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new BlackPolarDust();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.false;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(-2);
    expect(player.getProduction(Resources.HEAT)).eq(3);

    expect(game.deferredActions).has.lengthOf(1);
    const selectSpace = game.deferredActions.peek()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Cannot place ocean if no oceans left', function() {
    TestingUtils.maxOutOceans(player);
    card.play(player);
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
