import {expect} from 'chai';
import {FlatMarsTheory} from '../../../src/server/cards/pathfinders/FlatMarsTheory';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {testGame} from '../../TestGame';

describe('FlatMarsTheory', function() {
  let card: FlatMarsTheory;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new FlatMarsTheory();
    [game, player] = testGame(1);
  });

  it('canPlay', function() {
    player.tagsForTest = {};
    expect(player.simpleCanPlay(card)).is.true;

    player.tagsForTest = {science: 1};
    expect(player.simpleCanPlay(card)).is.true;

    player.tagsForTest = {science: 2};
    expect(player.simpleCanPlay(card)).is.false;

    player.tagsForTest = {science: 1, wild: 1};
    expect(player.simpleCanPlay(card)).is.true;

    player.tagsForTest = {wild: 2};
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('play', function() {
    (game as any).generation = 4;
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 4}));

    player.production.override(Units.EMPTY);
    (game as any).generation = 7;
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 7}));
  });
});
