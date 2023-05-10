import {expect} from 'chai';
import {PublicCelebrations} from '../../../src/server/cards/turmoil/PublicCelebrations';
import {testGameOptions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('PublicCelebrations', function() {
  it('Should play', function() {
    const card = new PublicCelebrations();
    const [game, player] = testGame(1, testGameOptions({turmoilExtension: true}));

    expect(player.canPlay(card, {testAffordability: false})).is.not.true;

    game.turmoil!.chairman = player.id;
    expect(player.canPlay(card, {testAffordability: false})).is.true;
    card.play(player);
  });
});
