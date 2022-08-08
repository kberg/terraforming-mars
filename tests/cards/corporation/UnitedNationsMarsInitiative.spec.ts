import {expect} from 'chai';
import {UnitedNationsMarsInitiative} from '../../../src/cards/corporation/UnitedNationsMarsInitiative';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('UnitedNationsMarsInitiative', function() {
  let card : UnitedNationsMarsInitiative; let player : Player; let game: Game;

  beforeEach(() => {
    card = new UnitedNationsMarsInitiative();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act if TR was not raised', function() {
    player.megaCredits = 10;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can\'t act if not enough MC', function() {
    player.setTerraformRating(21);
    player.megaCredits = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.increaseTerraformRating();
    player.megaCredits = 3;
    expect(card.canAct(player)).is.true;

    card.action(player);
    TestingUtils.runAllActions(game);
    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(22);
  });
});
