import {expect} from 'chai';
import {AstraMechanica} from '../../../src/cards/preludeTwo/AstraMechanica';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {DeimosDownPromo} from '../../../src/cards/promo/DeimosDownPromo';
import {LandClaim} from '../../../src/cards/base/LandClaim';
import {TechnologyDemonstration} from '../../../src/cards/base/TechnologyDemonstration';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';

describe('AstraMechanica', function() {
  let card : AstraMechanica; let player : Player; let player2 : Player;

  beforeEach(() => {
    card = new AstraMechanica();
    
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
  });

  it('Play - no eligible events', function() {
    player.playedCards.push(new DeimosDownPromo());
    expect(card.play(player)).is.undefined;
  });

  it('Play - has eligible events', function() {
    player.playedCards.push(new LandClaim(), new TechnologyDemonstration());

    const selectCard = card.play(player) as SelectCard<ICard>;
    selectCard.cb([selectCard.cards[0], selectCard.cards[1]]);
    expect(player.cardsInHand).has.length(2);
    expect(player.playedCards).has.length(0);
  });
});
