import {expect} from 'chai';
import {MetallicAsteroid} from '../../../src/cards/ares/MetallicAsteroid';
import {REDS_RULING_POLICY_COST} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('MetallicAsteroid', function() {
  let card: MetallicAsteroid; let player: Player; let otherPlayer: Player; let game: Game;

  beforeEach(() => {
    card = new MetallicAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Play', function() {
    otherPlayer.plants = 5;

    expect(player.titanium).eq(0);
    expect(game.getTemperature()).eq(-30);
    expect(game.deferredActions).has.lengthOf(0);

    const action = card.play(player);
    expect(player.titanium).eq(1);
    expect(game.getTemperature()).eq(-28);
    // This interrupt is for removing four plants. Not going to do further
    // testing on this because it's beyond the scope of this test without
    // exposing more from the source method.
    expect(game.deferredActions).is.length(1);

    const space = game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(space);
    expect(space.player).eq(player);
    expect(space.tile!.tileType).eq(TileType.METALLIC_ASTEROID);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.TITANIUM]});
  });

  it('Respects Reds', function() {
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, otherPlayer], player, gameOptions);

    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + REDS_RULING_POLICY_COST;
    expect(player.canPlay(card)).is.true;
  });
});
