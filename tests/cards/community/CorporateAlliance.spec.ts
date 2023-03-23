import {expect} from 'chai';
import {CorporateAlliance} from '../../../src/cards/community/preludes/CorporateAlliance';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('CorporateAlliance', function() {
  let card : CorporateAlliance; let player : Player; let game : Game;

  beforeEach(() => {
    card = new CorporateAlliance();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    const unity = turmoil.getPartyByName(PartyName.UNITY)!;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(unity.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });

  it('Works without Unity party in play', function() {
    const turmoil = game.turmoil!;
    turmoil.parties = [];

    card.play(player);
    expect(player.megaCredits).to.eq(7);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
