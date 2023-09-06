import {expect} from 'chai';
import {AppliedScience} from '../../../src/cards/preludeTwo/AppliedScience';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Ants} from '../../../src/cards/base/Ants';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';

describe('AppliedScience', function() {
  let card : AppliedScience; let player : Player;

  beforeEach(() => {
    card = new AppliedScience();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play(player);
    expect(card.resourceCount).eq(6);
  });

  it('Takes action', function() {
    const ants = new Ants();
    ants.resourceCount = 1;
    card.play(player);
    player.playedCards.push(card, ants);
    
    const orOptions = card.action(player) as OrOptions;
    expect(orOptions).instanceOf(OrOptions);

    const gainStandardResourceOptions = orOptions.options[0].cb() as OrOptions;
    expect(card.resourceCount).eq(5);
    gainStandardResourceOptions.options[0].cb();
    expect(player.titanium).eq(1);

    const selectCard = orOptions.options[1].cb() as SelectCard<ICard>;
    expect(card.resourceCount).eq(4);

    // Add resource to card Ants
    expect(selectCard).instanceOf(SelectCard);
    selectCard.cb([selectCard.cards[1]]);
    expect(ants.resourceCount).eq(2);
  });

  it('Edge case: Only 1 resource with no other resource cards', function() {
    player.playedCards.push(card);
    card.resourceCount = 1;
    
    const gainStandardResourceOptions = card.action(player) as OrOptions;
    expect(gainStandardResourceOptions).instanceOf(OrOptions);

    gainStandardResourceOptions.options[0].cb();
    expect(player.titanium).eq(1);
    expect(card.resourceCount).eq(0);
  });
});
