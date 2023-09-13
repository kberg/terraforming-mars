import {expect} from 'chai';
import {Ecotec} from '../../../src/cards/preludeTwo/Ecotec';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';

describe('Ecotec', function() {
  let card : Ecotec; let player : Player; let game: Game;
  let singleBioTagCard: IProjectCard; let twoBioTagsCard: IProjectCard;

  beforeEach(() => {
    card = new Ecotec();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);

    singleBioTagCard = {tags: [Tags.MICROBE]} as IProjectCard;
    twoBioTagsCard = {tags: [Tags.PLANT, Tags.ANIMAL]} as IProjectCard;
  });

  it('Play', function() {
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).eq(1);
    expect(player.plants).eq(2);
  });

  it('Effect with 1 bio tag: No microbe cards', function() {
    player.playedCards.push(card);    
    card.onCardPlayed(player, singleBioTagCard);
    expect(player.plants).eq(1);
  });

  it('Effect with 1 bio tag: Has 1 microbe card', function() {
    const tardigrades = new Tardigrades();
    player.playedCards.push(card, tardigrades);
    card.onCardPlayed(player, singleBioTagCard);
    expect(game.deferredActions).has.length(1);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;

    // Gain plant
    orOptions.options[1].cb();
    expect(player.plants).eq(1);

    // Add microbe to Tardigrades
    orOptions.options[0].cb();
    expect(tardigrades.resourceCount).eq(1);
  });

  it('Effect with 1 bio tag: Has multiple microbe cards', function() {
    const tardigrades = new Tardigrades();
    const decomposers = new Decomposers();
    player.playedCards.push(card, tardigrades, decomposers);
    card.onCardPlayed(player, singleBioTagCard);
    expect(game.deferredActions).has.length(1);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;

    // Gain plant
    orOptions.options[1].cb();
    expect(player.plants).eq(1);

    // Add microbe to Decomposers
    const selectCard = orOptions.options[0].cb() as SelectCard<ICard>;
    selectCard.cb([selectCard.cards[1]]);
    expect(decomposers.resourceCount).eq(1);
  });

  it('Works with multiple bio tags', function() {
    const tardigrades = new Tardigrades();
    player.playedCards.push(card, tardigrades);
    card.onCardPlayed(player, twoBioTagsCard);
    expect(game.deferredActions).has.length(2);
  });
});
