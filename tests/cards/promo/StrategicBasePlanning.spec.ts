import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {StrategicBasePlanning} from '../../../src/server/cards/promo/StrategicBasePlanning';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {assertPlaceCity} from '../../assertions';
import {assertBuildColony} from '../../colonies/coloniesAssertions';
import {runAllActions} from '../../TestingUtils';

describe('StrategicBasePlanning', () => {
  let card: StrategicBasePlanning;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new StrategicBasePlanning();
    // 2 players to remove an early-game solo action in the deferred actions queue.
    [game, player] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        // The important thing is that Europa is absent.
        ColonyName.GANYMEDE,
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.TITAN,
        ColonyName.TRITON],
    });
  });

  it('Should play', () => {
    game.deferredActions.pop();

    player.megaCredits = 100;
    card.play(player);

    // Expecting build colony before place city
    assertBuildColony(player, game.deferredActions.pop()!.execute());
    assertPlaceCity(player, game.deferredActions.pop()!.execute());

    runAllActions(game);
    expect(player.megaCredits).to.eq(97);
  });
});
