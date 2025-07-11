import {expect} from 'chai';
import {MagneticFieldGeneratorsPromo} from '../../../src/server/cards/promo/MagneticFieldGeneratorsPromo';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('MagneticFieldGeneratorsPromo', () => {
  let card: MagneticFieldGeneratorsPromo;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MagneticFieldGeneratorsPromo();
    [game, player] = testGame(2);
  });

  it('Cannot play without enough energy production', () => {
    player.production.add(Resource.ENERGY, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(2);
    expect(player.terraformRating).to.eq(23);
  });
});
