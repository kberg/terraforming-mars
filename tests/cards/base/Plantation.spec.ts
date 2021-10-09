import {expect} from 'chai';
import {Plantation} from '../../../src/cards/base/Plantation';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Plantation', function() {
  let card : Plantation; let player : Player; let game : Game;

  beforeEach(() => {
    card = new Plantation();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push({tags: [Tags.SCIENCE, Tags.SCIENCE]} as IProjectCard);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(game.getOxygenLevel()).eq(1);
  });
});
