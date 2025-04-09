import {expect} from 'chai';
import {Suburbian} from '../../src/server/awards/Suburbian';
import {addCity, addGreenery, testGame} from '../TestingUtils';

describe('Suburbian', () => {
  const award = new Suburbian();

  it('Simple test', () => {
    const [/* game */, player/* , player2 */] = testGame(2);

    expect(award.getScore(player)).to.eq(0);

    addCity(player, '03');
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player, '36');
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player, '37');
    expect(award.getScore(player)).to.eq(2);

    addGreenery(player, '38');
    expect(award.getScore(player)).to.eq(3);
  });
});
