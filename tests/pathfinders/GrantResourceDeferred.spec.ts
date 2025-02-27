import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {GrantResourceDeferred} from '../../src/server/pathfinders/GrantResourceDeferred';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {GainResources} from '../../src/server/inputs/GainResources';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {testGame} from '../TestGame';
import {Ants} from '../../src/server/cards/base/Ants';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {cast} from '../TestingUtils';

describe('GrantResourceDeferred', () => {
  let player: TestPlayer;
  let ants: Ants;
  let tardigrades: Tardigrades;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    ants = new Ants();
    tardigrades = new Tardigrades();
    player.playedCards.push(ants);
    player.playedCards.push(tardigrades);
  });

  it('grant single bonus', () => {
    const input = cast(new GrantResourceDeferred(player, false).execute(), OrOptions);
    expect(input.options).has.length(1);
    const gainResources = cast(input.options[0], GainResources);
    gainResources.options[0].cb(0);
    gainResources.options[1].cb(0);
    gainResources.options[2].cb(0);
    gainResources.options[3].cb(0);
    gainResources.options[4].cb(0);
    gainResources.options[5].cb(1);

    gainResources.cb(undefined);

    expect(player.megaCredits).eq(0);
    expect(player.steel).eq(0);
    expect(player.titanium).eq(0);
    expect(player.plants).eq(0);
    expect(player.energy).eq(0);
    expect(player.heat).eq(1);
  });

  it('grant single bonus or wild bonus', () => {
    const input = cast(new GrantResourceDeferred(player, true).execute(), OrOptions);
    expect(input.options).has.length(2);
    expect(input.options[0]).instanceOf(GainResources);
    const selectCard = cast(input.options[1], SelectCard<IProjectCard>);
    expect(selectCard.cards).has.members([ants, tardigrades]);
    expect(ants.resourceCount).eq(0);

    selectCard.cb([ants]);

    expect(ants.resourceCount).eq(1);
  });
});
