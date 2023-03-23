import {expect} from 'chai';
import {IntellectualistMovement} from '../../../src/cards/community/preludes/IntellectualistMovement';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('IntellectualistMovement', function() {
  let card : IntellectualistMovement; let player : Player; let game : Game;

  beforeEach(() => {
    card = new IntellectualistMovement();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    const scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;

    card.play(player);
    expect(player.cardsInHand).has.length(3);
    expect(scientists.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });

  it('Works without Scientists party in play', function() {
    const turmoil = game.turmoil!;
    turmoil.parties = [];

    card.play(player);
    expect(player.cardsInHand).has.length(3);
    expect(player.megaCredits).to.eq(7);
  });
});
