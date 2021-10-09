import {expect} from 'chai';
import {BiofertilizerFacility} from '../../../src/cards/ares/BiofertilizerFacility';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';
import {Tags} from '../../../src/cards/Tags';
import {ResourceType} from '../../../src/ResourceType';

describe('BiofertilizerFacility', function() {
  let card : BiofertilizerFacility; let player : Player; let game : Game;
  let scienceTagCard: IProjectCard;
  let microbeHost: IProjectCard;

  beforeEach(() => {
    card = new BiofertilizerFacility();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);

    scienceTagCard = {tags: [Tags.SCIENCE]} as IProjectCard;
    microbeHost = {tags: [Tags.MICROBE], resourceType: ResourceType.MICROBE, resourceCount: 0} as IProjectCard;
    player.playedCards.push(microbeHost);
  });

  it('Cannot play without a science tag', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Play', function() {
    // Adds the necessary Science tag.
    player.playedCards.push(scienceTagCard);
    // Initial expectations that will change after playing the card.
    expect(player.getProduction(Resources.PLANTS)).is.eq(0);
    expect(microbeHost.resourceCount).is.eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    expect(card.canPlay(player)).is.true;
    const action = card.play(player);
    expect(player.getProduction(Resources.PLANTS)).is.eq(1);

    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    action.cb(citySpace);

    expect(citySpace.player).eq(player);
    expect(citySpace.tile!.tileType).eq(TileType.BIOFERTILIZER_FACILITY);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE]});

    game.deferredActions.peek()!.execute();
    expect(microbeHost.resourceCount).is.eq(2);
  });
});
