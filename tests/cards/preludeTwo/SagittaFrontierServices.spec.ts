import {expect} from 'chai';
import {SagittaFrontierServices} from '../../../src/cards/preludeTwo/SagittaFrontierServices';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Insulation} from '../../../src/cards/base/Insulation';
import {Mine} from '../../../src/cards/base/Mine';
import {ReleaseOfInertGases} from '../../../src/cards/base/ReleaseOfInertGases';

describe('SagittaFrontierServices', function() {
  let card : SagittaFrontierServices; let player : Player;
  let singleTagCard: IProjectCard; let singleTagEventCard: IProjectCard; let noTagsCard: IProjectCard;

  beforeEach(() => {
    card = new SagittaFrontierServices();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);

    singleTagCard = new Mine();
    singleTagEventCard = new ReleaseOfInertGases();
    noTagsCard = new Insulation();
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
    expect(player.cardsInHand).has.length(1);
  });

  it('Effect: play card with no tags', function() {
    player.corporationCards.push(card);
    card.onCardPlayed(player, noTagsCard);
    expect(player.megaCredits).eq(4);
  });

  it('Effect: play card with 1 tag', function() {
    player.corporationCards.push(card);
    card.onCardPlayed(player, singleTagCard);
    expect(player.megaCredits).eq(1);

    card.onCardPlayed(player, singleTagEventCard);
    expect(player.megaCredits).eq(2);
  });
});
