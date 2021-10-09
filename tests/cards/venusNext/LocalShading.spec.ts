import {expect} from 'chai';
import {LocalShading} from '../../../src/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LocalShading', function() {
  let card : LocalShading; let player : Player;

  beforeEach(() => {
    card = new LocalShading();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).eq(1);

    const orOptions = card.action(player) as OrOptions;
    expect(orOptions).is.not.undefined;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(card.resourceCount).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
  });
});
