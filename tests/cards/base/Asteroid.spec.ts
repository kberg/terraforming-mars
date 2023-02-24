import {expect} from 'chai';
import {Asteroid} from '../../../src/cards/base/Asteroid';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Asteroid', function() {
  let card : Asteroid; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new Asteroid();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Should play', function() {
    player2.plants = 2;
    card.play(player);
    game.deferredActions.runNext(); // raise temperature
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[1].cb(); // do nothing
    expect(player2.getResource(Resources.PLANTS)).eq(2);

    orOptions.options[0].cb(); // remove plants
    expect(player2.getResource(Resources.PLANTS)).eq(0);

    expect(player.titanium).eq(2);
    expect(game.getTemperature()).eq(-28);
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
