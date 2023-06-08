import {expect} from 'chai';
import {TerraformingDeal} from '../../../src/cards/preludeTwo/TerraformingDeal';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';

describe('TerraformingDeal', function() {
  let card : TerraformingDeal; let player : Player; let player2 : Player;

  beforeEach(() => {
    card = new TerraformingDeal();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Gives 2 M€ for each step player raises their own TR', function() {
    player.playedCards.push(card);

    player.increaseTerraformRating();
    expect(player.megaCredits).eq(2);

    player.increaseTerraformRatingSteps(3);
    expect(player.megaCredits).eq(8);

    player2.increaseTerraformRating();
    expect(player.megaCredits).eq(8);
  });
});
