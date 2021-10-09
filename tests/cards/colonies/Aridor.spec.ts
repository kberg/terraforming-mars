import {expect} from 'chai';
import {Aridor} from '../../../src/cards/colonies/Aridor';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Aridor', function() {
  it('Should play', function() {
    const card = new Aridor();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const play = card.play();
    expect(play).is.undefined;
    player.corporationCard = card;

    card.onCardPlayed(player, {tags: [Tags.ANIMAL]} as IProjectCard);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    card.onCardPlayed(player2, {tags: [Tags.SCIENCE]} as IProjectCard);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    card.onCardPlayed(player, {tags: [Tags.SCIENCE, Tags.BUILDING, Tags.CITY]} as IProjectCard);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
