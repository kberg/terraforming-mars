import {expect} from 'chai';
import {ICard} from '../../../src/cards/ICard';
import {AirScrappingExpedition} from '../../../src/cards/venusNext/AirScrappingExpedition';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {DeuteriumExport} from '../../../src/cards/venusNext/DeuteriumExport';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('AirScrappingExpedition', function() {
  let card : AirScrappingExpedition; let player : Player; let game : Game;

  beforeEach(() => {
    card = new AirScrappingExpedition();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Works with multiple targets', function() {
    const corp = new Celestic();
    player.corporationCards = [corp];
    player.playedCards.push(new DeuteriumExport());

    const selectCard = card.play(player) as SelectCard<ICard>;
    expect(selectCard).is.not.undefined;
    expect(selectCard).instanceOf(SelectCard);

    selectCard.cb([selectCard.cards[1]]);
    expect(player.getResourcesOnCard(corp)).eq(3);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('Works with single target', function() {
    const corp = new Celestic();
    player.corporationCards = [corp];

    card.play(player);
    expect(player.getResourcesOnCard(corp)).eq(3);
    expect(game.getVenusScaleLevel()).eq(2);
  });
});
