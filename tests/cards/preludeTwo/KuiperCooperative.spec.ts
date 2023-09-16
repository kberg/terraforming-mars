import {expect} from 'chai';
import {KuiperCooperative} from '../../../src/cards/preludeTwo/KuiperCooperative';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {Satellites} from '../../../src/cards/base/Satellites';

describe('KuiperCooperative', function() {
  let card : KuiperCooperative; let player : Player;

  beforeEach(() => {
    card = new KuiperCooperative();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
  });

  it('canAct', function() {
    expect(card.canAct()).is.true;
  });

  it('Action', function() {
    player.corporationCards.push(card);
    card.action(player);
    expect(card.resourceCount).eq(2);

    player.playedCards.push(new Satellites());
    card.action(player);
    expect(card.resourceCount).eq(5);
  });
});
