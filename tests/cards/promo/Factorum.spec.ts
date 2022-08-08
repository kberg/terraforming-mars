import {expect} from 'chai';
import {Factorum} from '../../../src/cards/promo/Factorum';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectOption} from '../../../src/inputs/SelectOption';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Factorum', function() {
  let card: Factorum; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    card = new Factorum();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    game = Game.newInstance('foobar', [player, player2], player);
    player.corporationCards = [card];
  })

  it('Should play', function() {
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.STEEL)).eq(1);
    player.megaCredits = 10;

    const action = card.action(player) as OrOptions;
    expect(action).instanceOf(OrOptions);

    expect(action.options).has.lengthOf(2);
    const orOptions = action.options[1] as OrOptions;

    orOptions.cb();
    TestingUtils.runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).eq(7);

    const orOptions2 = action.options[0] as OrOptions;
    orOptions2.cb();
    expect(player.getProduction(Resources.ENERGY)).eq(1);
  });

  it('Only offer building card if player has energy', function() {
    const play = card.play(player);
    expect(play).is.undefined;
    player.megaCredits = 10;
    player.energy = 1;

    const selectOption = card.action(player) as SelectOption;
    selectOption.cb();
    TestingUtils.runAllActions(game);

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].tags).includes(Tags.BUILDING);
    expect(player.megaCredits).to.eq(7);
  });
});
