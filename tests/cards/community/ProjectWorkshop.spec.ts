import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/cards/base/AdvancedAlloys';
import {SmallAnimals} from '../../../src/cards/base/SmallAnimals';
import {CardType} from '../../../src/cards/CardType';
import {ProjectWorkshop} from '../../../src/cards/community/corporations/ProjectWorkshop';
import {ICard} from '../../../src/cards/ICard';
import {Extremophiles} from '../../../src/cards/venusNext/Extremophiles';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {AncientShipyards} from '../../../src/cards/moon/AncientShipyards';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {Birds} from '../../../src/cards/base/Birds';
import {Phase} from '../../../src/Phase';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {TestingUtils} from '../../TestingUtils';

describe('ProjectWorkshop', function() {
  let card : ProjectWorkshop; let player : Player; let game : Game; let advancedAlloys : AdvancedAlloys;

  beforeEach(() => {
    card = new ProjectWorkshop();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    advancedAlloys = new AdvancedAlloys();

    card.play(player);
    player.corporationCard = card;
  });

  it('Starts with correct resources', function() {
    expect(player.steel).eq(1);
    expect(player.titanium).eq(1);

    card.initialAction(player);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].cardType).eq(CardType.ACTIVE);
  });

  it('Can\'t act', function() {
    player.megaCredits = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can spend 4 M€ to draw a blue card', function() {
    player.megaCredits = 4;

    expect(card.canAct(player)).is.true;
    card.action(player);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].cardType).eq(CardType.ACTIVE);
  });

  it('Can flip a played blue card and remove its ongoing effects', function() {
    player.playedCards.push(advancedAlloys);
    advancedAlloys.play(player);
    player.megaCredits = 0;

    expect(player.getSteelValue()).eq(3);
    expect(player.getTitaniumValue()).eq(4);

    card.action(player);
    expect(player.playedCards).has.lengthOf(0);
    expect(game.dealer.discarded.includes(advancedAlloys)).is.true;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.getSteelValue()).eq(2);
    expect(player.getTitaniumValue()).eq(3);
  });

  it('Converts VP to TR correctly', function() {
    const smallAnimals = new SmallAnimals();
    player.addResourceTo(smallAnimals, 5);

    const extremophiles = new Extremophiles();
    player.addResourceTo(extremophiles, 11);

    const originalTR = player.getTerraformRating();
    player.playedCards.push(smallAnimals, extremophiles);

    const selectCard = card.action(player) as SelectCard<ICard>;;
    selectCard.cb([smallAnimals]);
    expect(player.getTerraformRating()).eq(originalTR + 2);
    expect(player.cardsInHand).has.lengthOf(2);

    selectCard.cb([extremophiles]);
    expect(player.getTerraformRating()).eq(originalTR + 5);
    expect(player.cardsInHand).has.lengthOf(4);
  });

  it('Can select option if able to do both actions', function() {
    player.playedCards.push(advancedAlloys);
    player.megaCredits = 4;
    const result = card.action(player);
    expect(result).instanceOf(OrOptions);
  });

  it('Project Workshop removes TR when flipping Ancient Shipyards', () => {
    const ancientShipyards = new AncientShipyards();
    player.addResourceTo(ancientShipyards, 5);
    player.playedCards.push(ancientShipyards);
    player.megaCredits = 4;

    const originalTR = player.getTerraformRating();
    const result = card.action(player) as OrOptions;
    expect(result).instanceOf(OrOptions);
    expect(result.options).has.lengthOf(2);

    result!.options[1].cb([ancientShipyards]);
    expect(player.playedCards).is.empty;
    expect(game.dealer.discarded.includes(ancientShipyards)).is.true;
    expect(player.getTerraformRating()).to.eq(originalTR - 5);
    expect(player.cardsInHand).has.lengthOf(2);
  });

  it('Works with Reds taxes', () => {
    const player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions({turmoilExtension: true}));

    card.play(player);
    player.corporationCard = card;
    player.game.phase = Phase.ACTION;

    const turmoil = game.turmoil!;
    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    const smallAnimals = new SmallAnimals();
    player.addResourceTo(smallAnimals, 4);
    expect(smallAnimals.getVictoryPoints()).eq(2);

    const extremophiles = new Extremophiles();
    player.addResourceTo(extremophiles, 9);
    expect(extremophiles.getVictoryPoints()).eq(3);

    const birds = new Birds();
    birds.resourceCount = 1;
    expect(birds.getVictoryPoints()).eq(1);

    player.playedCards.push(smallAnimals, extremophiles, birds);

    const selectCard = function() {
      const orOptions = TestingUtils.cast(card.action(player), OrOptions);
      return TestingUtils.cast(orOptions.options[1].cb(), SelectCard);
    };

    player.megaCredits = 9;
    expect(selectCard().cards).has.members([smallAnimals, extremophiles, birds]);

    player.megaCredits = 8;
    expect(selectCard().cards).has.members([smallAnimals, birds]);

    player.megaCredits = 6;
    expect(selectCard().cards).has.members([smallAnimals, birds]);

    const originalTR = player.getTerraformRating();
    player.megaCredits = 5;

    const orOptions = TestingUtils.cast(card.action(player), OrOptions);
    expect(orOptions.options[1].cb()).is.undefined;
    TestingUtils.runAllActions(game);

    expect(player.playedCards).has.members([smallAnimals, extremophiles]);
    expect(game.dealer.discarded).contains(birds);
    expect(player.getTerraformRating()).to.eq(originalTR + 1);
    expect(player.megaCredits).eq(2); // Spent 3MC for the reds tax.
  });
});
