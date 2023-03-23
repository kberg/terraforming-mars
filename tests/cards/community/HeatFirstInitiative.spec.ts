import {expect} from 'chai';
import {HeatFirstInitiative} from '../../../src/cards/community/preludes/HeatFirstInitiative';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('HeatFirstInitiative', function() {
  let card : HeatFirstInitiative; let player : Player; let game : Game;

  beforeEach(() => {
    card = new HeatFirstInitiative();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    const kelvinists = turmoil.getPartyByName(PartyName.KELVINISTS)!;

    card.play(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(kelvinists.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });

  it('Works without Kelvinists party in play', function() {
    const turmoil = game.turmoil!;
    turmoil.parties = [];

    card.play(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(player.megaCredits).to.eq(7);
  });
});
