import {expect} from 'chai';
import {OldMiningColony} from '../../../src/cards/preludeTwo/OldMiningColony';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game, GameOptions} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {Iapetus} from '../../../src/cards/community/colonies/Iapetus';
import {TestingUtils} from '../../TestingUtils';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Ants} from '../../../src/cards/base/Ants';
import {Mine} from '../../../src/cards/base/Mine';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {SelectCard} from '../../../src/inputs/SelectCard';

describe('OldMiningColony', function() {
  let card : OldMiningColony; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new OldMiningColony();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    
    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true}) as GameOptions;
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    game.colonies.push(new Iapetus()); // ensure an open colony is always available
  });

  it('Play', function() {
    card.play(player);
    player.cardsInHand.push(new Ants(), new Mine());
    expect(player.getProduction(Resources.TITANIUM)).eq(1);

    const selectColony = game.deferredActions.pop()!.execute() as SelectColony;
    selectColony.cb((<any>ColonyName)[selectColony.coloniesModel[0].name.toUpperCase()]);
    expect(game.colonies.some((colony) => colony.colonies.includes(player.id))).is.true;

    const discardCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(discardCard).instanceOf(SelectCard);

    discardCard.cb([discardCard.cards[0]]);
    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
