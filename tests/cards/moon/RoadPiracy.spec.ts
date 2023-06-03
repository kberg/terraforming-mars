import {Game} from '../../../src/Game';
import {RoadPiracy} from '../../../src/cards/moon/RoadPiracy';
import {expect} from 'chai';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('RoadPiracy', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: RoadPiracy;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.GREEN.newPlayer();

    game = Game.newInstance('id', [player, player2, player3], player);
    card = new RoadPiracy();

    player.popWaitingFor(); // To clear out the SelectInitialCards input
  });

  it('No players have resources', () => {
    expect(card.play(player)).is.undefined;
    TestingUtils.runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('Players only have steel', () => {
    player2.steel = 2;
    player3.steel = 5;
    const orOptions = card.play(player) as OrOptions;
    expect(orOptions.options.length).eq(2);

    const stealSteel = orOptions.options[0] as AndOptions;
    stealSteel.options[0].cb(2);
    stealSteel.options[1].cb(4);
    stealSteel.cb();

    expect(player.steel).eq(6);
    expect(player2.steel).eq(0);
    expect(player3.steel).eq(1);
  });

  it('Players only have titanium', () => {
    player2.titanium = 2;
    player3.titanium = 5;
    const orOptions = card.play(player) as OrOptions;
    expect(orOptions.options.length).eq(2);

    const stealTitanium = orOptions.options[0] as AndOptions;
    stealTitanium.options[0].cb(2);
    stealTitanium.options[1].cb(1);
    stealTitanium.cb();

    expect(player.titanium).eq(3);
    expect(player2.titanium).eq(0);
    expect(player3.titanium).eq(4);
  });

  it('Do not select', () => {
    player2.titanium = 2;
    player3.titanium = 5;
    const orOptions = card.play(player) as OrOptions;
    expect(orOptions.options.length).eq(2);

    orOptions.options[1].cb();
    expect(player.titanium).eq(0);
    expect(player2.titanium).eq(2);
    expect(player3.titanium).eq(5);
  });
});

