import {expect} from "chai";
import {Darwin} from "../../src/cards/leaders/Darwin";
import {Game} from "../../src/Game";
import {Player} from "../../src/Player";
import {PartyName} from "../../src/turmoil/parties/PartyName";
import {Turmoil} from "../../src/turmoil/Turmoil";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";

describe('Darwin', function() {
  let card: Darwin; let player: Player; let player2: Player; let game: Game; let turmoil: Turmoil;

  beforeEach(() => {
    card = new Darwin();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player.playedCards.push(card);

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil as Turmoil;

    // Manually set up some neutral delegates
    turmoil.parties.forEach((party) => party.delegates = []);
    turmoil.chairman = "NEUTRAL";

    const scientists = turmoil.getPartyByName(PartyName.SCIENTISTS)!;
    turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);
    turmoil.sendDelegateToParty("NEUTRAL", scientists.name, game);

    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    turmoil.sendDelegateToParty("NEUTRAL", greens.name, game);

    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    turmoil.sendDelegateToParty("NEUTRAL", reds.name, game);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });
  
  it('Action: Gain 2 temporary influence for this generation only', function() {
    const action = card.action();
    expect(action).is.undefined;
    expect(turmoil.getPlayerInfluence(player)).to.eq(2);

    TestingUtils.forceGenerationEnd(game);
    expect(turmoil.getPlayerInfluence(player)).to.eq(0);
  });

  it('Effect: Gain 2 M€ whenever the dominant party changes', function() {
    // Scientists are currently dominant
    player.megaCredits = 0;

    // Make Greens dominant
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    expect(player.megaCredits).to.eq(2);

    // Make Scientists dominant againi
    turmoil.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.SCIENTISTS, game);
    expect(player.megaCredits).to.eq(4);
  });

  it('Can only act once per game', function() {
    card.action();
    TestingUtils.forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
