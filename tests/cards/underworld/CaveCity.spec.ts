import {expect} from 'chai';
import {CaveCity} from '../../../src/server/cards/underworld/CaveCity';
import {testGame} from '../../TestGame';
import {cast, churn} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {Units} from '../../../src/common/Units';

describe('CaveCity', () => {
  it('canPlay', () => {
    const card = new CaveCity();
    const [/* game */, player] = testGame(2);

    expect(card.canPlay(player)).is.false;

    const space = player.game.board.getAvailableSpacesOnLand(player)[0];
    space.excavator = player;

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new CaveCity();
    const [/* game */, player] = testGame(2);

    const [space1, space2] = player.game.board.getAvailableSpacesForCity(player);
    space1.excavator = player;
    space2.excavator = player;

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);

    expect(selectSpace.spaces).to.have.members([space1, space2]);

    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1}));
  });
});
