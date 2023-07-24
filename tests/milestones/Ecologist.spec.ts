
import {expect} from 'chai';
import {Ecologist} from '../../src/milestones/Ecologist';
import {ResearchNetwork} from '../../src/cards/prelude/ResearchNetwork';
import {TestPlayers} from '../TestPlayers';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Lichen} from '../../src/cards/base/Lichen';
import {Tardigrades} from '../../src/cards/base/Tardigrades';
import {Fish} from '../../src/cards/base/Fish';
import {Birds} from '../../src/cards/base/Birds';
import {Xavier} from '../../src/cards/leaders/Xavier';

describe('Ecologist', function() {
  let milestone : Ecologist; let player : Player;

  beforeEach(() => {
    milestone = new Ecologist();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foo', [player], player);
  });

  it('Counts bio tags', function() {
    player.playedCards.push(new Lichen(), new Tardigrades(), new Fish());
    expect(milestone.canClaim(player)).is.false;

    player.playedCards.push(new Birds());
    expect(milestone.canClaim(player)).is.true;
  });

  it('Counts wildcard tags', function() {
    player.playedCards.push(new Lichen(), new Tardigrades(), new Fish(), new ResearchNetwork());
    expect(milestone.canClaim(player)).is.true;
  });

  it('Works with Xavier CEO', function() {
    player.playedCards.push(new Lichen(), new Tardigrades());

    const xavier = new Xavier();
    player.playedCards.push(xavier);
    xavier.action();
    expect(milestone.canClaim(player)).is.true;
  });
});
