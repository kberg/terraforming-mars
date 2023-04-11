import {expect} from 'chai';
import {MediaArchives} from '../../../src/cards/base/MediaArchives';
import {Virus} from '../../../src/cards/base/Virus';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('MediaArchives', function() {
  it('Should play', function() {
    const card = new MediaArchives();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    player.playedCards.push(card, new Virus());
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).eq(1);
  });

  it('Works with Automa solo variant', function() {
    const card = new MediaArchives();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({automaSoloVariant: true}));
    player.playedCards.push(card, new Virus());

    card.play(player);
    expect(player.megaCredits).eq(3);
  });
});
