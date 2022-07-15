import {expect} from 'chai';
import {MagneticFieldDome} from '../../../src/cards/base/MagneticFieldDome';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('MagneticFieldDome', function() {
  let card : MagneticFieldDome; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new MagneticFieldDome();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    player.addProduction(Resources.ENERGY, 2);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST;
    expect(player.canPlay(card)).is.true;
  });
});
