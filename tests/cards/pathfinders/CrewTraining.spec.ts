import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {CrewTraining} from '../../../src/server/cards/pathfinders/CrewTraining';
import {IGame} from '../../../src/server/IGame';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {DeclareCloneTag} from '../../../src/server/pathfinders/DeclareCloneTag';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../TestingUtils';

describe('CrewTraining', () => {
  let card: CrewTraining;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CrewTraining();
    [game, player] = testGame(1, {pathfindersExpansion: true});
  });

  it('Should play', () => {
    expect(player.terraformRating).eq(14);
    expect(card.tags).deep.eq([Tag.CLONE, Tag.CLONE]);

    card.play(player);

    expect(player.terraformRating).eq(16);

    expect(game.deferredActions).has.length(1);
    const action = cast(game.deferredActions.pop(), DeclareCloneTag);
    const options = cast(action.execute(), OrOptions);

    expect(options.options[1].title).to.match(/earth/);
    expect(game.pathfindersData).deep.eq({
      venus: 0,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    options.options[1].cb();

    expect(game.pathfindersData).deep.eq({
      venus: 0,
      earth: 2,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });
    expect(card.tags).deep.eq([Tag.EARTH, Tag.EARTH]);
  });
});
