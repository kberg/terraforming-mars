import {expect} from 'chai';
import {ValuableGases} from '../../../src/cards/community/preludes/ValuableGases';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';

describe('ValuableGases', function() {
  let card : ValuableGases; let player : Player; let  game: Game;

  beforeEach(() => {
    card = new ValuableGases();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.megaCredits).eq(6);
  });

  it('Play: Picks up target cards with tag requirements for Jovian tags', function() {
    player.megaCredits = 50;
    const jovianLanterns = new JovianLanterns();
    player.cardsInHand.push(jovianLanterns);

    player.playCard(card);

    // Add the card to playedCards
    game.deferredActions.runNext();
    expect(player.playedCards.includes(card)).is.true;
    expect(player.getPlayableCards().includes(jovianLanterns)).is.true;
  });
});
