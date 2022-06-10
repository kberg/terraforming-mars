import {expect} from 'chai';
import {Pets} from '../../../src/cards/base/Pets';
import {MarketManipulation} from '../../../src/cards/colonies/MarketManipulation';
import {Callisto} from '../../../src/colonies/Callisto';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Enceladus} from '../../../src/colonies/Enceladus';
import {Europa} from '../../../src/colonies/Europa';
import {Luna} from '../../../src/colonies/Luna';
import {Miranda} from '../../../src/colonies/Miranda';
import {Pluto} from '../../../src/colonies/Pluto';
import {Game} from '../../../src/Game';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('MarketManipulation', function() {
  let card : MarketManipulation; let player : Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new MarketManipulation();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
  });

  it('Should play', function() {
    game.colonies = [new Pluto(), new Callisto(), new Europa()];

    card.play(player);
    const increaseColonyAction = game.deferredActions.pop()!.execute() as SelectColony;
    increaseColonyAction.cb((<any>ColonyName)[increaseColonyAction.coloniesModel[0].name.toUpperCase()]);
    expect(game.colonies[0].trackPosition).to.eq(2);
    expect(game.colonies[1].trackPosition).to.eq(1);
    expect(game.colonies[2].trackPosition).to.eq(1);

    const decreaseColonyAction = game.deferredActions.pop()!.execute() as SelectColony;
    decreaseColonyAction.cb((<any>ColonyName)[decreaseColonyAction.coloniesModel[0].name.toUpperCase()]);
    expect(game.colonies[0].trackPosition).to.eq(2);
    expect(game.colonies[1].trackPosition).to.eq(0);
    expect(game.colonies[2].trackPosition).to.eq(1);
  });

  it('Should not allow increase of sole decreasable colony', function() {
    const pluto = new Pluto();
    pluto.trackPosition = 0;
    const callisto = new Callisto();
    callisto.trackPosition = 0;
    const europa = new Europa();
    europa.trackPosition = 1;

    player.game.colonies = [pluto, callisto, europa];
    player.game.gameOptions.coloniesExtension = true;
    card.play(player);

    const increaseColonyAction = game.deferredActions.pop()!.execute() as SelectColony;
    expect(increaseColonyAction.coloniesModel.length).to.eq(2);
    increaseColonyAction.cb((<any>ColonyName)[increaseColonyAction.coloniesModel[0].name.toUpperCase()]);
    expect(game.colonies[0].trackPosition).to.eq(1);
    expect(game.colonies[1].trackPosition).to.eq(0);
    expect(game.colonies[2].trackPosition).to.eq(1);

    const decreaseColonyAction = game.deferredActions.pop()!.execute() as SelectColony;
    expect(decreaseColonyAction.coloniesModel.length).to.eq(1);
    decreaseColonyAction.cb((<any>ColonyName)[decreaseColonyAction.coloniesModel[0].name.toUpperCase()]);
    expect(game.colonies[0].trackPosition).to.eq(1);
    expect(game.colonies[1].trackPosition).to.eq(0);
    expect(game.colonies[2].trackPosition).to.eq(0);
  });

  it('Can\'t play', function() {
    game.colonies = [new Enceladus(), new Miranda(), new Luna()];
    expect(card.canPlay(player)).is.false;

    player.playCard(new Pets());
    expect(card.canPlay(player)).is.true;
  });
});
