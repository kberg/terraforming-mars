import {expect} from "chai";
import {IProjectCard} from "../../src/cards/IProjectCard";
import {Eunice} from "../../src/cards/leaders/Eunice";
import {DomeFarming} from "../../src/cards/prelude/DomeFarming";
import {EcologyExperts} from "../../src/cards/prelude/EcologyExperts";
import {EccentricSponsor} from "../../src/cards/prelude/EccentricSponsor";
import {MoholeExcavation} from "../../src/cards/prelude/MoholeExcavation";
import {Game} from "../../src/Game";
import {SelectCard} from "../../src/inputs/SelectCard";
import {Player} from "../../src/Player";
import {TestingUtils} from "../TestingUtils";
import {TestPlayers} from "../TestPlayers";
import {AsteroidMining} from "../../src/cards/base/AsteroidMining";
import {KelpFarming} from "../../src/cards/base/KelpFarming";

describe('Eunice', function() {
  let card: Eunice; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Eunice();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    player.playedCards.push(new DomeFarming(), new MoholeExcavation());
    player2.playedCards.push(new EcologyExperts(), new EccentricSponsor());

    player.megaCredits = 20;
  });

  it('Can act', function() {
    player.megaCredits = 11;
    expect(card.canAct(player)).is.false;

    player.megaCredits = 12;
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    const action = card.action(player);
    expect(action).is.undefined;

    // Pay 12 M€
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(8);

    // Set opgActionIsActive to true
    game.deferredActions.runNext();

    // Copy a prelude
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(selectCard.cards).has.length(4);
    selectCard.cb([selectCard.cards[0]]);
    game.deferredActions.runNext();

    // Gain 3X M€
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(11);
  });

  it('Can only act once per game', function() {
    card.action(player);
    game.deferredActions.runAll(() => {});
    TestingUtils.forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Works with Eccentric Sponsor', function() {
    player.megaCredits = 50;
    player.playedCards.push(card);
    const asteroidMining = new AsteroidMining();
    expect(player.getCardCost(asteroidMining)).eq(30);

    const action = card.action(player);
    expect(action).is.undefined;

    // Pay 12 M€
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(38);

    // Set opgActionIsActive to true
    game.deferredActions.runNext();
    expect(card.opgActionIsActive).is.true;

    // Copy Eccentric Sponsor prelude
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(selectCard.cards).has.length(4);
    selectCard.cb([selectCard.cards[3]]);
    // Play the target card
    game.deferredActions.runNext();

    // Run the deferred actions for Double Down and Eunice
    game.deferredActions.runNext();
    game.deferredActions.runNext();
    game.deferredActions.runNext();

    expect(player.cardDiscount).to.eq(25);
    expect(player.getCardCost(asteroidMining)).eq(5);

    game.deferredActions.runAll(() => {});
    expect(player.cardDiscount).to.eq(0);
  });

  it('Works with Ecology Experts', function() {
    player.megaCredits = 50;
    player.playedCards.push(card);
    const kelpFarming = new KelpFarming();
    expect(player.canPlay(kelpFarming)).is.false;

    const action = card.action(player);
    expect(action).is.undefined;

    // Pay 12 M€
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(38);

    // Set opgActionIsActive to true
    game.deferredActions.runNext();
    expect(card.opgActionIsActive).is.true;

    // Copy Ecology Experts prelude
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(selectCard.cards).has.length(4);
    selectCard.cb([selectCard.cards[2]]);
    // Play the target card
    game.deferredActions.runNext();

    // Run the deferred actions for Double Down and Eunice
    game.deferredActions.runNext();
    game.deferredActions.runNext();
    game.deferredActions.runNext();

    expect(player.requirementsBonus).to.eq(50);
    expect(player.canPlay(kelpFarming)).is.true;

    game.deferredActions.runAll(() => {});
    expect(player.requirementsBonus).to.eq(0);
  });
});
