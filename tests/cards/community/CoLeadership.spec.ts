import {expect} from 'chai';
import {CardType} from '../../../src/cards/CardType';
import {CoLeadership} from '../../../src/cards/community/preludes/CoLeadership';
import {ICard} from '../../../src/cards/ICard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('CoLeadership', function() {
  it('Should play', function() {
    const card = new CoLeadership();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({leadersExpansion: true});
    const game = Game.newInstance('foobar', [player], player, gameOptions);
    
    const selectCard = card.play(player) as SelectCard<ICard>;
    selectCard.cb([selectCard.cards[0]]);;
    game.deferredActions.runAll(() => {});

    expect(player.playedCards.filter((c) => c.cardType === CardType.LEADER)).has.length(1);
  });
});
