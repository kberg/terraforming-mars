import {expect} from 'chai';
import {Cartel} from '../../../src/cards/base/Cartel';
import {CardType} from '../../../src/cards/CardType';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Cartel', function() {
  let card : Cartel; let player : Player;

  beforeEach(() => {
    card = new Cartel();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    player.playedCards.push(card);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);
  });

  it('Correctly counts tags', function() {
    const cards = [
      {tags: [Tags.EARTH]} as IProjectCard,
      {tags: [Tags.EARTH, Tags.EVENT], cardType: CardType.EVENT} as IProjectCard,
    ];

    player.playedCards = player.playedCards.concat(cards);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2); // exclude events
  });
});
