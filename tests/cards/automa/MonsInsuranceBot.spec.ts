import {expect} from 'chai';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {MonsInsuranceBot} from '../../../src/cards/automa/MonsInsuranceBot';
import {Resources} from '../../../src/Resources';
import {Sabotage} from '../../../src/cards/base/Sabotage';
import {GreatEscarpmentConsortium} from '../../../src/cards/base/GreatEscarpmentConsortium';

describe('MonsInsuranceBot', function() {
  let card : MonsInsuranceBot; let player : Player; let game : Game;

  beforeEach(() => {
    card = new MonsInsuranceBot();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    game.automaBotCorporation = card;
    game.automaBotVictoryPointsBreakdown.terraformRating = 20;
  });

  it('Takes initial action', function() {
    const initialMegacreditsProduction = player.getProduction(Resources.MEGACREDITS);
    card.initialAction(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(initialMegacreditsProduction - 2);
  });
  
  it('Takes action', function() {
    card.action(player);
    expect(game.automaBotVictoryPointsBreakdown.terraformRating).eq(21);
  });

  it('Player gains 3 M€ when decreasing the bot\'s resources', function() {
    player.playCard(new Sabotage());
    expect(player.megaCredits).eq(3);
  });

  it('Player gains 3 M€ when decreasing the bot\'s production', function() {
    player.playCard(new GreatEscarpmentConsortium());
    game.deferredActions.runAll(() => {});
    expect(player.megaCredits).eq(3);
  });
});
