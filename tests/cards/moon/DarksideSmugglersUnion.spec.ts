import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {DarksideSmugglersUnion} from '../../../src/cards/moon/DarksideSmugglersUnion';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TurmoilPolicy} from '../../../src/turmoil/TurmoilPolicy';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {SelectColony} from '../../../src/inputs/SelectColony';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({coloniesExtension: true, moonExpansion: true});

describe('DarksideSmugglersUnion', () => {
  let player: Player;
  let card: DarksideSmugglersUnion;
  let moonData: IMoonData;
  let game: Game;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new DarksideSmugglersUnion();
    moonData = MoonExpansion.moonData(game);

    game.colonies = [new Luna(), new Triton()];
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;

    const turmoil = Turmoil.getTurmoil(game);    
    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, reds, TurmoilPolicy.REDS_DEFAULT_POLICY);

    player.megaCredits = 2;
    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    card.play(player);
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });

  it('can act', () => {
    expect(card.canAct(player)).is.true;

    game.colonies.forEach((colony) => colony.visitor = player.id);
    expect(card.canAct(player)).is.false;
  });

  it('action', () => {
    const action = card.action(player);
    expect(action).is.undefined;

    game.deferredActions.runNext();
    const selectColony = game.deferredActions.pop()!.execute() as SelectColony;
    selectColony.cb((<any>ColonyName)["LUNA"]);
    expect(player.megaCredits).to.eq(2);
  });
});

