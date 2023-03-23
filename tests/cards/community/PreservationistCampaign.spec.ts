import {expect} from 'chai';
import {PreservationistCampaign} from '../../../src/cards/community/preludes/PreservationistCampaign';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('PreservationistCampaign', function() {
  let card : PreservationistCampaign; let player : Player; let game : Game;

  beforeEach(() => {
    card = new PreservationistCampaign();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    const turmoil = game.turmoil!;
    const reds = turmoil.getPartyByName(PartyName.REDS)!;

    card.play(player);
    expect(player.getTerraformRating()).to.eq(19);
    expect(player.megaCredits).to.eq(18);
    expect(reds.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });

  it('Works without Reds party in play', function() {
    const turmoil = game.turmoil!;
    turmoil.parties = [];

    card.play(player);
    expect(player.getTerraformRating()).to.eq(19);
    expect(player.megaCredits).to.eq(25);
  });
});
