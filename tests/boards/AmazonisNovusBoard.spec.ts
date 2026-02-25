import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {expect} from 'chai';
import {AmazonisNovusBoard} from '../../src/server/boards/AmazonisNovusBoard';
import {SeededRandom} from '../../src/common/utils/Random';

describe('AmazonisNovusBoard', () => {
  it('sanity test', () => {
    const board = AmazonisNovusBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(board.spaces).to.deep.eq([
      {id: '01', spaceType: 'colony', bonus: [], x: -1, y: -1},
      {id: '02', spaceType: 'colony', bonus: [], x: -1, y: -1},
      // y=0, x=5..10
      {id: '03', spaceType: 'land', bonus: [1], x: 5, y: 0},
      {id: '04', spaceType: 'land', bonus: [1, 1], x: 6, y: 0},
      {id: '05', spaceType: 'land', bonus: [1], x: 7, y: 0},
      {id: '06', spaceType: 'land', bonus: [3], x: 8, y: 0},
      {id: '07', spaceType: 'land', bonus: [0, 0], x: 9, y: 0},
      {id: '08', spaceType: 'land', bonus: [], x: 10, y: 0},
      // y=1, x=4..10
      {id: '09', spaceType: 'ocean', bonus: [], x: 4, y: 1},
      {id: '10', spaceType: 'land', bonus: [16], x: 5, y: 1},
      {id: '11', spaceType: 'land', bonus: [1], x: 6, y: 1},
      {id: '12', spaceType: 'land', bonus: [], x: 7, y: 1},
      {id: '13', spaceType: 'land', bonus: [2], x: 8, y: 1},
      {id: '14', spaceType: 'ocean', bonus: [2, 2], x: 9, y: 1},
      {id: '15', spaceType: 'ocean', bonus: [0, 0], x: 10, y: 1},
      // y=2, x=3..10
      {id: '16', spaceType: 'ocean', bonus: [1, 1], x: 3, y: 2},
      {id: '17', spaceType: 'land', bonus: [], x: 4, y: 2},
      {id: '18', spaceType: 'land', bonus: [3, 3], x: 5, y: 2},
      {id: '19', spaceType: 'land', bonus: [], x: 6, y: 2},
      {id: '20', spaceType: 'land', bonus: [2], x: 7, y: 2},
      {id: '21', spaceType: 'ocean', bonus: [], x: 8, y: 2},
      {id: '22', spaceType: 'land', bonus: [], x: 9, y: 2},
      {id: '23', spaceType: 'land', bonus: [], x: 10, y: 2},
      // y=3, x=2..10
      {id: '24', spaceType: 'land', bonus: [0], x: 2, y: 3},
      {id: '25', spaceType: 'ocean', bonus: [], x: 3, y: 3},
      {id: '26', spaceType: 'land', bonus: [], x: 4, y: 3},
      {id: '27', spaceType: 'land', bonus: [], x: 5, y: 3},
      {id: '28', spaceType: 'land', bonus: [2], x: 6, y: 3},
      {id: '29', spaceType: 'land', bonus: [2], x: 7, y: 3},
      {id: '30', spaceType: 'land', bonus: [2, 2], x: 8, y: 3},
      {id: '31', spaceType: 'land', bonus: [2], x: 9, y: 3},
      {id: '32', spaceType: 'land', bonus: [2, 3], x: 10, y: 3},
      // y=4, x=1..10
      {id: '33', spaceType: 'land', volcanic: true, bonus: [1, 1], x: 1, y: 4},
      {id: '34', spaceType: 'land', bonus: [2], x: 2, y: 4},
      {id: '35', spaceType: 'land', bonus: [19], x: 3, y: 4},
      {id: '36', spaceType: 'land', bonus: [2], x: 4, y: 4},
      {id: '37', spaceType: 'ocean', bonus: [3], x: 5, y: 4},
      {id: '38', spaceType: 'land', bonus: [2], x: 6, y: 4},
      {id: '39', spaceType: 'land', bonus: [2, 2], x: 7, y: 4},
      {id: '40', spaceType: 'land', bonus: [2], x: 8, y: 4},
      {id: '41', spaceType: 'land', bonus: [19], x: 9, y: 4},
      {id: '42', spaceType: 'ocean', bonus: [2, 2], x: 10, y: 4},
      // y=5, x=0..10
      {id: '43', spaceType: 'land', bonus: [2], x: 0, y: 5},
      {id: '44', spaceType: 'land', bonus: [2], x: 1, y: 5},
      {id: '45', spaceType: 'land', bonus: [2, 2], x: 2, y: 5},
      {id: '46', spaceType: 'land', bonus: [2, 2], x: 3, y: 5},
      {id: '47', spaceType: 'ocean', bonus: [2, 2], x: 4, y: 5},
      {id: '48', spaceType: 'ocean', bonus: [2, 2], x: 5, y: 5},
      {id: '49', spaceType: 'land', bonus: [1, 2, 2], x: 6, y: 5},
      {id: '50', spaceType: 'land', bonus: [2], x: 7, y: 5},
      {id: '51', spaceType: 'land', bonus: [], x: 8, y: 5},
      {id: '52', spaceType: 'land', bonus: [2], x: 9, y: 5},
      {id: '53', spaceType: 'ocean', bonus: [3], x: 10, y: 5},
      // y=6, x=1..10
      {id: '54', spaceType: 'land', bonus: [2], x: 1, y: 6},
      {id: '55', spaceType: 'land', bonus: [2, 2], x: 2, y: 6},
      {id: '56', spaceType: 'ocean', bonus: [2, 2], x: 3, y: 6},
      {id: '57', spaceType: 'land', bonus: [9, 9], x: 4, y: 6},
      {id: '58', spaceType: 'land', bonus: [9], x: 5, y: 6},
      {id: '59', spaceType: 'land', bonus: [9, 9], x: 6, y: 6},
      {id: '60', spaceType: 'land', bonus: [], x: 7, y: 6},
      {id: '61', spaceType: 'land', bonus: [2], x: 8, y: 6},
      {id: '62', spaceType: 'land', bonus: [2], x: 9, y: 6},
      {id: '63', spaceType: 'land', bonus: [], x: 10, y: 6},
      // y=7, x=2..10
      {id: '64', spaceType: 'land', bonus: [2], x: 2, y: 7},
      {id: '65', spaceType: 'ocean', bonus: [3, 3], x: 3, y: 7},
      {id: '66', spaceType: 'land', bonus: [2], x: 4, y: 7},
      {id: '67', spaceType: 'land', bonus: [9], x: 5, y: 7},
      {id: '68', spaceType: 'land', bonus: [9, 9], x: 6, y: 7},
      {id: '69', spaceType: 'land', bonus: [2], x: 7, y: 7},
      {id: '70', spaceType: 'land', volcanic: true, bonus: [16, 16], x: 8, y: 7},
      {id: '71', spaceType: 'land', bonus: [1], x: 9, y: 7},
      {id: '72', spaceType: 'land', volcanic: true, bonus: [16], x: 10, y: 7},
      // y=8, x=3..10
      {id: '73', spaceType: 'ocean', bonus: [1, 0], x: 3, y: 8},
      {id: '74', spaceType: 'land', bonus: [], x: 4, y: 8},
      {id: '75', spaceType: 'land', bonus: [0], x: 5, y: 8},
      {id: '76', spaceType: 'land', bonus: [], x: 6, y: 8},
      {id: '77', spaceType: 'land', bonus: [], x: 7, y: 8},
      {id: '78', spaceType: 'land', bonus: [2, 2], x: 8, y: 8},
      {id: '79', spaceType: 'land', bonus: [], x: 9, y: 8},
      {id: '80', spaceType: 'land', volcanic: true, bonus: [0], x: 10, y: 8},
      // y=9, x=4..10
      {id: '81', spaceType: 'ocean', bonus: [], x: 4, y: 9},
      {id: '82', spaceType: 'land', bonus: [], x: 5, y: 9},
      {id: '83', spaceType: 'land', bonus: [19], x: 6, y: 9},
      {id: '84', spaceType: 'land', bonus: [], x: 7, y: 9},
      {id: '85', spaceType: 'land', bonus: [2, 2, 2], x: 8, y: 9},
      {id: '86', spaceType: 'land', bonus: [2, 2], x: 9, y: 9},
      {id: '87', spaceType: 'land', volcanic: true, bonus: [1, 1], x: 10, y: 9},
      // y=10, x=5..10
      {id: '88', spaceType: 'land', bonus: [], x: 5, y: 10},
      {id: '89', spaceType: 'land', bonus: [1, 0], x: 6, y: 10},
      {id: '90', spaceType: 'land', bonus: [1, 1], x: 7, y: 10},
      {id: '91', spaceType: 'land', bonus: [], x: 8, y: 10},
      {id: '92', spaceType: 'land', bonus: [2], x: 9, y: 10},
      {id: '93', spaceType: 'land', bonus: [3], x: 10, y: 10},
    ]);
    expect(board.volcanicSpaceIds).deep.eq(['33', '70', '72', '80', '87']);
    expect(board.maxOceans).to.eq(11);
    expect(board.maxTemperature).to.eq(14);
    expect(board.maxOxygen).to.eq(18);
    expect(board.maxVenus).to.eq(30);
  });
});
