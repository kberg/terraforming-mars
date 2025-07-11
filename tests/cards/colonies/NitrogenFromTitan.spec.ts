import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {NitrogenFromTitan} from '../../../src/server/cards/colonies/NitrogenFromTitan';
import {TitanFloatingLaunchPad} from '../../../src/server/cards/colonies/TitanFloatingLaunchPad';
import {ICard} from '../../../src/server/cards/ICard';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('NitrogenFromTitan', () => {
  let card: NitrogenFromTitan;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NitrogenFromTitan();
    [game, player] = testGame(2);
  });

  it('Can play without floaters', () => {
    const tr = player.terraformRating;
    card.play(player);
    expect(player.terraformRating).to.eq(tr + 2);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  it('Can play with single Jovian floater card', () => {
    const jovianLanterns = new JovianLanterns();
    player.playedCards.push(jovianLanterns);

    card.play(player);
    player.game.deferredActions.runNext();
    expect(jovianLanterns.resourceCount).to.eq(2);
  });

  it('Can play with multiple Jovian floater cards', () => {
    const jovianLanterns = new JovianLanterns();
    player.playedCards.push(jovianLanterns, new TitanFloatingLaunchPad());

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([jovianLanterns]);
    expect(jovianLanterns.resourceCount).to.eq(2);
  });
});
