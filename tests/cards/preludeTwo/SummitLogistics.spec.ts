import {expect} from 'chai';
import {SummitLogistics} from '../../../src/cards/preludeTwo/SummitLogistics';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {SisterPlanetSupport} from '../../../src/cards/venusNext/SisterPlanetSupport';
import {VestaShipyard} from '../../../src/cards/base/VestaShipyard';
import {Luna} from '../../../src/colonies/Luna';

describe('SummitLogistics', function() {
  let card : SummitLogistics; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new SummitLogistics();
    
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
  });

  it('canPlay', function() {
    expect(card.canPlay(player)).is.false;

    const turmoil = Turmoil.getTurmoil(game);
    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    const scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;

    turmoil.rulingParty = reds;
    expect(card.canPlay(player)).is.false;

    turmoil.rulingParty = scientists;    
    expect(card.canPlay(player)).is.true;
  });

  it('Play', function() {
    player.playedCards.push(new SisterPlanetSupport(), new VestaShipyard());
    const colony1 = new Luna();
    colony1.colonies.push(player.id);
    game.colonies.push(colony1);

    card.play(player);
    expect(player.cardsInHand).has.length(2);
    expect(player.megaCredits).eq(4);
  });
});
