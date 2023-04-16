import {expect} from 'chai';
import {GHGProducingBacteria} from '../../../src/cards/base/GHGProducingBacteria';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('GHGProducingBacteria', () => {
  let card : GHGProducingBacteria; let player : Player; let game : Game;

  beforeEach(() => {
    card = new GHGProducingBacteria();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play', () => {
    game.setOxygenLevel(3);
    expect(card.canPlay(player)).is.false;
    game.setOxygenLevel(4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    game.setOxygenLevel(4);
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', () => {
    player.playedCards.push(card);

    card.action(player);
    expect(card.resourceCount).eq(1);

    card.action(player);
    expect(card.resourceCount).eq(2);

    const orAction = card.action(player) as OrOptions;
    expect(orAction).instanceOf(OrOptions);

    orAction!.options[1].cb();
    expect(card.resourceCount).eq(3);

    orAction!.options[0].cb();
    expect(card.resourceCount).eq(1);
    expect(game.getTemperature()).eq(-28);
  });
});
