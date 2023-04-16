import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {ICard} from '../../../src/cards/ICard';
import {Atmoscoop} from '../../../src/cards/venusNext/Atmoscoop';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {MAX_TEMPERATURE, MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Atmoscoop', function() {
  let card : Atmoscoop; let player : Player; let player2 : Player;
  let game : Game; let dirigibles: Dirigibles; let floatingHabs: FloatingHabs;

  beforeEach(() => {
    card = new Atmoscoop();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    dirigibles = new Dirigibles();
    floatingHabs = new FloatingHabs();
  });

  it('Can\'t play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - no targets', function() {
    player.playedCards.push(new Research(), new SearchForLife());
    expect(card.canPlay(player)).is.true;

    const action = card.play(player) as OrOptions;
    expect(action).instanceOf(OrOptions);

    expect(action.options).has.lengthOf(2);
    const orOptions = action.options[1] as OrOptions;

    orOptions.cb();
    expect(game.getVenusScaleLevel()).eq(4);
  });

  it('Should play - single target', function() {
    player.playedCards.push(dirigibles);

    const action = card.play(player) as OrOptions;
    expect(action).instanceOf(OrOptions);

    const orOptions = action.options[1] as OrOptions;
    orOptions.cb();
    expect(game.getVenusScaleLevel()).eq(4);
    expect(dirigibles.resourceCount).eq(2);
  });

  it('Should play - multiple targets', function() {
    player.playedCards.push(dirigibles, floatingHabs);

    const orOptions = card.play(player) as OrOptions;

    // First the global parameter
    orOptions.options[0].cb();
    expect(game.getTemperature()).eq(-26);
    orOptions.options[1].cb();
    expect(game.getVenusScaleLevel()).eq(4);

    // Then the floaters
    const selectCard = orOptions.cb() as SelectCard<ICard>;
    selectCard.cb([dirigibles]);
    expect(dirigibles.resourceCount).eq(2);
    selectCard.cb([floatingHabs]);
    expect(floatingHabs.resourceCount).eq(2);
  });

  it('Should play - single target, one global parameter maxed', function() {
    player.playedCards.push(dirigibles);
    game.setTemperature(MAX_TEMPERATURE);

    const orOptions = card.play(player) as OrOptions;
    orOptions.options[1].cb();
    expect(game.getVenusScaleLevel()).eq(4);

    const action = orOptions.cb() as SelectCard<ICard>;
    expect(action).is.undefined;    
    expect(dirigibles.resourceCount).eq(2);
  });

  it('Should play - single target, both global parameters maxed', function() {
    player.playedCards.push(dirigibles);
    game.setVenusScaleLevel(MAX_VENUS_SCALE);
    game.setTemperature(MAX_TEMPERATURE);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(dirigibles.resourceCount).eq(2);
  });

  it('Should play - multiple targets, one global parameter maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    game.setTemperature(MAX_TEMPERATURE);

    // Even with a maxed global parameter, we can still choose to raise that parameter
    // It's wasteful, but theoretically valid if we don't want to raise the other parameter
    const orOptions = card.play(player) as OrOptions;
    orOptions.options[0].cb();
    expect(game.getTemperature()).eq(MAX_TEMPERATURE);

    const selectCard = orOptions.cb() as SelectCard<ICard>;
    selectCard.cb([dirigibles]);
    expect(dirigibles.resourceCount).eq(2);
  });

  it('Should play - multiple targets, both global parameters maxed', function() {
    player.playedCards.push(dirigibles, floatingHabs);
    game.setVenusScaleLevel(MAX_VENUS_SCALE);
    game.setTemperature(MAX_TEMPERATURE);

    const action = card.play(player) as SelectCard<ICard>;
    expect(action).instanceOf(SelectCard);
    action.cb([dirigibles]);
    expect(dirigibles.resourceCount).eq(2);
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);

    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.playedCards.push(new Research(), new SearchForLife());

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST * 2;
    expect(player.canPlay(card)).is.true;
  });
});
