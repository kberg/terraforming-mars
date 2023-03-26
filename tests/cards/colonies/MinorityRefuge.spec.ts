import {expect} from 'chai';
import {MinorityRefuge} from '../../../src/cards/colonies/MinorityRefuge';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {Game} from '../../../src/Game';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MinorityRefuge', function() {
  let card : MinorityRefuge; let player : Player; let game: Game;

  beforeEach(() => {
    card = new MinorityRefuge();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);

    const colony1 = new Luna();
    const colony2 = new Triton();
    game.colonies = [colony1, colony2];
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;

    const selectColony = game.deferredActions.pop()!.execute() as SelectColony;
    expect(selectColony.coloniesModel).has.length(2);
    selectColony.cb((<any>ColonyName)[selectColony.coloniesModel[1].name.toUpperCase()]);
    expect(player.titanium).to.eq(3);

    game.deferredActions.pop()!.execute();
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
  });

  it('Edge case: Can only build on Luna', function() {
    player.addProduction(Resources.MEGACREDITS, -5);
    const action = card.play(player);
    expect(action).is.undefined;

    // Only Luna colony is available
    const selectColony = game.deferredActions.pop()!.execute() as SelectColony;
    expect(selectColony.coloniesModel).has.length(1);

    selectColony.cb((<any>ColonyName)[selectColony.coloniesModel[0].name.toUpperCase()]);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-3);

    game.deferredActions.pop()!.execute();
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5);
  });
});
