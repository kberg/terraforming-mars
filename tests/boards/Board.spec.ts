import {expect} from 'chai';
import {TharsisBoard} from '../../src/server/boards/TharsisBoard';
import {AmazonisNovusBoard} from '../../src/server/boards/AmazonisNovusBoard';
import {Player} from '../../src/server/Player';
import {TileType} from '../../src/common/TileType';
import {Space} from '../../src/server/boards/Space';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayer} from '../TestPlayer';
import {Board} from '../../src/server/boards/Board';
import {SerializedBoard} from '../../src/server/boards/SerializedBoard';
import {NamedMoonSpaces} from '../../src/common/moon/NamedMoonSpaces';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../../src/server/game/GameOptions';
import {SpaceId} from '../../src/common/Types';
import {CardName} from '../../src/common/cards/CardName';
import {SpaceName} from '../../src/common/boards/SpaceName';
import {testGame} from '../TestGame';
import {toID} from '../../src/common/utils/utils';

describe('Board', () => {
  let board: Board;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    // Rather than create a whole game around this test, I'm mocking data to make the tests pass.
    const gameOptions: Partial<GameOptions> = {pathfindersExpansion: false};
    (player as any).game = {gameOptions};
    (player2 as any).game = {gameOptions};
  });

  it('getSpace', () => {
    expect(board.getSpaceOrThrow('01').spaceType).eq(SpaceType.COLONY);
    expect(board.getSpaceOrThrow('01').id).eq('01');
    expect(() => board.getSpaceOrThrow(NamedMoonSpaces.LUNA_TRADE_STATION).id).to.throw(Error, /Can't find space with id m01/);
  });

  it('getAdjacentSpaces', () => {
    const expectedAdjacentSpaces: Map<string, Array<string>> = new Map([
      ['01', []],
      ['02', []],
      ['03', ['04', '09', '08']],
      ['04', ['05', '10', '09', '03']],
      ['05', ['06', '11', '10', '04']],
      ['06', ['07', '12', '11', '05']],
      ['07', ['13', '12', '06']],
      ['08', ['03', '09', '15', '14']],
      ['09', ['03', '04', '10', '16', '15', '08']],
      ['10', ['04', '05', '11', '17', '16', '09']],
      ['11', ['05', '06', '12', '18', '17', '10']],
      ['12', ['06', '07', '13', '19', '18', '11']],
      ['13', ['07', '20', '19', '12']],
      ['14', ['08', '15', '22', '21']],
      ['15', ['08', '09', '16', '23', '22', '14']],
      ['16', ['09', '10', '17', '24', '23', '15']],
      ['17', ['10', '11', '18', '25', '24', '16']],
      ['18', ['11', '12', '19', '26', '25', '17']],
      ['19', ['12', '13', '20', '27', '26', '18']],
      ['20', ['13', '28', '27', '19']],
      ['21', ['14', '22', '30', '29']],
      ['22', ['14', '15', '23', '31', '30', '21']],
      ['23', ['15', '16', '24', '32', '31', '22']],
      ['24', ['16', '17', '25', '33', '32', '23']],
      ['25', ['17', '18', '26', '34', '33', '24']],
      ['26', ['18', '19', '27', '35', '34', '25']],
      ['27', ['19', '20', '28', '36', '35', '26']],
      ['28', ['20', '37', '36', '27']],
      ['29', ['21', '30', '38']],
      ['30', ['21', '22', '31', '39', '38', '29']],
      ['31', ['22', '23', '32', '40', '39', '30']],
      ['32', ['23', '24', '33', '41', '40', '31']],
      ['33', ['24', '25', '34', '42', '41', '32']],
      ['34', ['25', '26', '35', '43', '42', '33']],
      ['35', ['26', '27', '36', '44', '43', '34']],
      ['36', ['27', '28', '37', '45', '44', '35']],
      ['37', ['28', '45', '36']],
      ['38', ['29', '30', '39', '46']],
      ['39', ['30', '31', '40', '47', '46', '38']],
      ['40', ['31', '32', '41', '48', '47', '39']],
      ['41', ['32', '33', '42', '49', '48', '40']],
      ['42', ['33', '34', '43', '50', '49', '41']],
      ['43', ['34', '35', '44', '51', '50', '42']],
      ['44', ['35', '36', '45', '52', '51', '43']],
      ['45', ['36', '37', '52', '44']],
      ['46', ['38', '39', '47', '53']],
      ['47', ['39', '40', '48', '54', '53', '46']],
      ['48', ['40', '41', '49', '55', '54', '47']],
      ['49', ['41', '42', '50', '56', '55', '48']],
      ['50', ['42', '43', '51', '57', '56', '49']],
      ['51', ['43', '44', '52', '58', '57', '50']],
      ['52', ['44', '45', '58', '51']],
      ['53', ['46', '47', '54', '59']],
      ['54', ['47', '48', '55', '60', '59', '53']],
      ['55', ['48', '49', '56', '61', '60', '54']],
      ['56', ['49', '50', '57', '62', '61', '55']],
      ['57', ['50', '51', '58', '63', '62', '56']],
      ['58', ['51', '52', '63', '57']],
      ['59', ['53', '54', '60']],
      ['60', ['54', '55', '61', '59']],
      ['61', ['55', '56', '62', '60']],
      ['62', ['56', '57', '63', '61']],
      ['63', ['57', '58', '62']],
      ['69', []],
    ]);
    board.spaces.forEach((space) => {
      const expected = expectedAdjacentSpaces.get(space.id);
      const actual = board.getAdjacentSpaces(space).map(toID);
      expect(expected).to.eql(actual);
    });
  });

  it('has error with input while calling getAdjacentSpaces', () => {
    expect(() => {
      board.getAdjacentSpaces({
        x: 0,
        y: 0,
        bonus: [],
        id: 'foobar' as SpaceId,
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space ID foobar');
  });

  it('getAdjacentSpacesClockwise', () => {
    expect(
      board.getAdjacentSpacesClockwise(
        board.getSpaceOrThrow('51'))
        .map((space) => space?.id))
      .deep.eq(['43', '44', '52', '58', '57', '50']);

    expect(
      board.getAdjacentSpacesClockwise(
        board.getSpaceOrThrow('20'))
        .map((space) => space?.id))
      .deep.eq(['13', undefined, undefined, '28', '27', '19']);

    expect(
      board.getAdjacentSpacesClockwise(
        board.getSpaceOrThrow('03'))
        .map((space) => space?.id))
      .deep.eq([undefined, undefined, '04', '09', '08', undefined]);
  });

  it('getNthAvailableLandSpace', () => {
    // board spaces start at 03, and the top of the map looks like this
    //
    //    l o l o o
    //   l l l l l o
    expect(board.getNthAvailableLandSpace(0, 'top').id).eq('03');
    expect(board.getNthAvailableLandSpace(1, 'top').id).eq('05');
    expect(board.getNthAvailableLandSpace(2, 'top').id).eq('08');
    expect(board.getNthAvailableLandSpace(3, 'top').id).eq('09');
    // Filter changes available spaces.
    expect(board.getNthAvailableLandSpace(3, 'top', (s) => s.id !== '09').id).eq('10');

    // bottom ends at 63 and looks like this
    //
    //  l l l l l l
    //   l l l l o
    expect(board.getNthAvailableLandSpace(0, 'bottom').id).eq('62');
    expect(board.getNthAvailableLandSpace(1, 'bottom').id).eq('61');
    expect(board.getNthAvailableLandSpace(2, 'bottom').id).eq('60');
    expect(board.getNthAvailableLandSpace(3, 'bottom').id).eq('59');
  });

  it('getNthAvailableLandSpace throws if no spaces available', () => {
    expect(() => {
      board.getNthAvailableLandSpace(0, 'top', () => false);
    }).to.throw('no spaces available');
  });

  function expectSpace(space: Space, id: string, x: number, y: number) {
    if (id !== space.id || x !== space.x || y !== space.y) {
      expect.fail(`space ${space.id} at (${space.x}, ${space.y}) does not match [${id}, ${x}, ${y}]`);
    }
  }

  it('getNthAvailableLandSpace positive', () => {
    // First two rows look like this:
    //  - o - o o      - means land
    // - - - - - o     o means ocean
    // This will skip ocean spaces.

    expectSpace(board.getNthAvailableLandSpace(0, 'top'), '03', 4, 0);
    expectSpace(board.getNthAvailableLandSpace(1, 'top'), '05', 6, 0);
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '08', 3, 1);
    expectSpace(board.getNthAvailableLandSpace(3, 'top'), '09', 4, 1);
  });

  it('getNthAvailableLandSpace negative', () => {
    // Last two rows look like this:
    // - - - - - -    - means land
    //  - - - - o     o means ocean

    expectSpace(board.getNthAvailableLandSpace(0, 'bottom'), '62', 7, 8);
    expectSpace(board.getNthAvailableLandSpace(1, 'bottom'), '61', 6, 8);
    expectSpace(board.getNthAvailableLandSpace(2, 'bottom'), '60', 5, 8);
    expectSpace(board.getNthAvailableLandSpace(3, 'bottom'), '59', 4, 8);
  });

  it('getNthAvailableLandSpace skips tiles', () => {
    const space = board.getNthAvailableLandSpace(2, 'top');
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '08', 3, 1);
    space.tile = {tileType: TileType.GREENERY};
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '09', 4, 1);
  });

  it('getNthAvailableLandSpace skips hazard tiles', () => {
    const space = board.getNthAvailableLandSpace(2, 'top');
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '08', 3, 1);
    space.tile = {tileType: TileType.DUST_STORM_MILD};
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '09', 4, 1);
  });

  // This happens with the Ares expansion and cards come out mid-game
  // after the board is already populated. Though, here, the high
  // card costs substitite for a heavily-populated board.
  it('getNthAvailableLandSpace with a large card', () => {
    expect(board.getNthAvailableLandSpace(46, 'top').id).eq('61');
    expect(board.getNthAvailableLandSpace(47, 'top').id).eq('62');
    expect(board.getNthAvailableLandSpace(48, 'top').id).eq('03');
    expect(board.getNthAvailableLandSpace(49, 'top').id).eq('05');
    expect(board.getNthAvailableLandSpace(50, 'top').id).eq('08');

    expect(board.getNthAvailableLandSpace(46, 'bottom').id).eq('05');
    expect(board.getNthAvailableLandSpace(47, 'bottom').id).eq('03');
    expect(board.getNthAvailableLandSpace(48, 'bottom').id).eq('62');
    expect(board.getNthAvailableLandSpace(49, 'bottom').id).eq('61');
    expect(board.getNthAvailableLandSpace(50, 'bottom').id).eq('60');
  });

  class TestBoard extends Board {
  }

  it('deserialize', () => {
    const boardJson: SerializedBoard = {
      'spaces': [
        {
          'id': '01',
          'spaceType': SpaceType.COLONY, 'bonus': [],
          'x': -1, 'y': -1, 'player': 'p-name-1-id',
          'tile': {'tileType': 2},
        },
        {
          'id': '03',
          'spaceType': SpaceType.LAND, 'bonus': [1, 1],
          'x': 4, 'y': 0, 'player': 'p-name-2-id',
          'tile': {'tileType': 0},
        },
        {
          'id': '04',
          'spaceType': SpaceType.OCEAN, 'bonus': [1, 1],
          'x': 5, 'y': 0,
          'tile': {'tileType': 1},
        },
        {
          'id': '05',
          'spaceType': SpaceType.LAND, 'bonus': [],
          'x': 6, 'y': 0,
        },
      ],
    };
    const player1 = new Player('name-1', 'red', false, 0, 'p-name-1-id');
    const player2 = new Player('name-2', 'yellow', false, 0, 'p-name-2-id');

    const board = new TestBoard(Board.deserialize(boardJson, [player1, player2]).spaces);
    expect(board.getSpaceOrThrow('01').player).eq(player1);
    expect(board.getSpaceOrThrow('03').player).eq(player2);
  });

  it('Create specifying volcanic spaces', () => {
    const spaces: Array<Space> = [
      {id: '01', x: 0, y: 0, spaceType: SpaceType.LAND, bonus: []},
      {id: '02', x: 1, y: 0, spaceType: SpaceType.LAND, volcanic: true, bonus: []},
      {id: '03', x: 2, y: 0, spaceType: SpaceType.LAND, bonus: []},
    ];
    const board = new TestBoard(spaces);
    expect(board.getSpaceOrThrow('01').volcanic).is.undefined;
    expect(board.getSpaceOrThrow('02').volcanic).is.true;
    expect(board.getSpaceOrThrow('03').volcanic).is.undefined;
    expect(board.volcanicSpaceIds).deep.eq(['02']);
  });

  it('Create defining volcanic spaces', () => {
    const spaces: Array<Space> = [
      {id: '01', x: 0, y: 0, spaceType: SpaceType.LAND, bonus: []},
      {id: '02', x: 1, y: 0, spaceType: SpaceType.LAND, bonus: [], volcanic: true},
      {id: '03', x: 2, y: 0, spaceType: SpaceType.LAND, bonus: []},
    ];
    const board = new TestBoard(spaces);
    expect(board.getSpaceOrThrow('01').volcanic).is.undefined;
    expect(board.getSpaceOrThrow('02').volcanic).is.true;
    expect(board.getSpaceOrThrow('03').volcanic).is.undefined;
    expect(board.volcanicSpaceIds).deep.eq(['02']);
  });

  const runs = [
    {cards: [], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN]},
    {cards: [CardName.STANFORD_TORUS], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN, SpaceName.STANFORD_TORUS]},
    {cards: [CardName.VENERA_BASE], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN, SpaceName.VENERA_BASE]},
    {cards: [CardName.STANFORD_TORUS, CardName.VENERA_BASE], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN, SpaceName.STANFORD_TORUS, SpaceName.VENERA_BASE]},
  ] as const;
  for (const run of runs) {
    it('including cards adds their spaces ' + JSON.stringify(run.cards), () => {
      const [game] = testGame(1, {includedCards: run.cards});
      const spaceIds = game.board.spaces.filter((space) => space.spaceType === SpaceType.COLONY).map(toID);
      expect(spaceIds).to.have.members(run.spaces);
    });
  }
});

describe('Board — AmazonisNovusBoard adjacency', () => {
  it('getAdjacentSpaces', () => {
    const board = AmazonisNovusBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    const expectedAdjacentSpaces: Map<string, Array<string>> = new Map([
      ['01', []],
      ['02', []],
      // y=0 (upper half: bottomLeft[0]--, topRight[0]++)
      ['03', ['04', '10', '09']],
      ['04', ['05', '11', '10', '03']],
      ['05', ['06', '12', '11', '04']],
      ['06', ['07', '13', '12', '05']],
      ['07', ['08', '14', '13', '06']],
      ['08', ['15', '14', '07']],
      // y=1 (upper half)
      ['09', ['03', '10', '17', '16']],
      ['10', ['03', '04', '11', '18', '17', '09']],
      ['11', ['04', '05', '12', '19', '18', '10']],
      ['12', ['05', '06', '13', '20', '19', '11']],
      ['13', ['06', '07', '14', '21', '20', '12']],
      ['14', ['07', '08', '15', '22', '21', '13']],
      ['15', ['08', '23', '22', '14']],
      // y=2 (upper half)
      ['16', ['09', '17', '25', '24']],
      ['17', ['09', '10', '18', '26', '25', '16']],
      ['18', ['10', '11', '19', '27', '26', '17']],
      ['19', ['11', '12', '20', '28', '27', '18']],
      ['20', ['12', '13', '21', '29', '28', '19']],
      ['21', ['13', '14', '22', '30', '29', '20']],
      ['22', ['14', '15', '23', '31', '30', '21']],
      ['23', ['15', '32', '31', '22']],
      // y=3 (upper half)
      ['24', ['16', '25', '34', '33']],
      ['25', ['16', '17', '26', '35', '34', '24']],
      ['26', ['17', '18', '27', '36', '35', '25']],
      ['27', ['18', '19', '28', '37', '36', '26']],
      ['28', ['19', '20', '29', '38', '37', '27']],
      ['29', ['20', '21', '30', '39', '38', '28']],
      ['30', ['21', '22', '31', '40', '39', '29']],
      ['31', ['22', '23', '32', '41', '40', '30']],
      ['32', ['23', '42', '41', '31']],
      // y=4 (upper half)
      ['33', ['24', '34', '44', '43']],
      ['34', ['24', '25', '35', '45', '44', '33']],
      ['35', ['25', '26', '36', '46', '45', '34']],
      ['36', ['26', '27', '37', '47', '46', '35']],
      ['37', ['27', '28', '38', '48', '47', '36']],
      ['38', ['28', '29', '39', '49', '48', '37']],
      ['39', ['29', '30', '40', '50', '49', '38']],
      ['40', ['30', '31', '41', '51', '50', '39']],
      ['41', ['31', '32', '42', '52', '51', '40']],
      ['42', ['32', '53', '52', '41']],
      // y=5 (middle row: bottomRight[0]++, topRight[0]++)
      ['43', ['33', '44', '54']],
      ['44', ['33', '34', '45', '55', '54', '43']],
      ['45', ['34', '35', '46', '56', '55', '44']],
      ['46', ['35', '36', '47', '57', '56', '45']],
      ['47', ['36', '37', '48', '58', '57', '46']],
      ['48', ['37', '38', '49', '59', '58', '47']],
      ['49', ['38', '39', '50', '60', '59', '48']],
      ['50', ['39', '40', '51', '61', '60', '49']],
      ['51', ['40', '41', '52', '62', '61', '50']],
      ['52', ['41', '42', '53', '63', '62', '51']],
      ['53', ['42', '63', '52']],
      // y=6 (lower half: bottomRight[0]++, topLeft[0]--)
      ['54', ['43', '44', '55', '64']],
      ['55', ['44', '45', '56', '65', '64', '54']],
      ['56', ['45', '46', '57', '66', '65', '55']],
      ['57', ['46', '47', '58', '67', '66', '56']],
      ['58', ['47', '48', '59', '68', '67', '57']],
      ['59', ['48', '49', '60', '69', '68', '58']],
      ['60', ['49', '50', '61', '70', '69', '59']],
      ['61', ['50', '51', '62', '71', '70', '60']],
      ['62', ['51', '52', '63', '72', '71', '61']],
      ['63', ['52', '53', '72', '62']],
      // y=7 (lower half)
      ['64', ['54', '55', '65', '73']],
      ['65', ['55', '56', '66', '74', '73', '64']],
      ['66', ['56', '57', '67', '75', '74', '65']],
      ['67', ['57', '58', '68', '76', '75', '66']],
      ['68', ['58', '59', '69', '77', '76', '67']],
      ['69', ['59', '60', '70', '78', '77', '68']],
      ['70', ['60', '61', '71', '79', '78', '69']],
      ['71', ['61', '62', '72', '80', '79', '70']],
      ['72', ['62', '63', '80', '71']],
      // y=8 (lower half)
      ['73', ['64', '65', '74', '81']],
      ['74', ['65', '66', '75', '82', '81', '73']],
      ['75', ['66', '67', '76', '83', '82', '74']],
      ['76', ['67', '68', '77', '84', '83', '75']],
      ['77', ['68', '69', '78', '85', '84', '76']],
      ['78', ['69', '70', '79', '86', '85', '77']],
      ['79', ['70', '71', '80', '87', '86', '78']],
      ['80', ['71', '72', '87', '79']],
      // y=9 (lower half)
      ['81', ['73', '74', '82', '88']],
      ['82', ['74', '75', '83', '89', '88', '81']],
      ['83', ['75', '76', '84', '90', '89', '82']],
      ['84', ['76', '77', '85', '91', '90', '83']],
      ['85', ['77', '78', '86', '92', '91', '84']],
      ['86', ['78', '79', '87', '93', '92', '85']],
      ['87', ['79', '80', '93', '86']],
      // y=10 (lower half)
      ['88', ['81', '82', '89']],
      ['89', ['82', '83', '90', '88']],
      ['90', ['83', '84', '91', '89']],
      ['91', ['84', '85', '92', '90']],
      ['92', ['85', '86', '93', '91']],
      ['93', ['86', '87', '92']],
    ]);
    board.spaces.forEach((space) => {
      const expected = expectedAdjacentSpaces.get(space.id);
      const actual = board.getAdjacentSpaces(space).map(toID);
      expect(expected, `space ${space.id}`).to.eql(actual);
    });
  });

  it('colony spaces have no adjacency', () => {
    const board = AmazonisNovusBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    const colonySpaces = board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    expect(colonySpaces).has.length(2);
    for (const space of colonySpaces) {
      expect(board.getAdjacentSpaces(space)).to.be.empty;
    }
  });
});
