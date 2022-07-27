import {expect} from 'chai';
import {Aridor} from '../../../src/cards/colonies/Aridor';
import {Venus} from '../../../src/cards/community/colonies/Venus';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Game} from '../../../src/Game';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Aridor', function() {
  let card: Aridor; let player: Player; let player2: Player; let game: Game;

  beforeEach(() => {
    card = new Aridor();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    player.corporationCards = [card];
  });

  it('Should play', function() {
    const play = card.play();
    expect(play).is.undefined;

    card.onCardPlayed(player, {tags: [Tags.ANIMAL]} as IProjectCard);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    card.onCardPlayed(player2, {tags: [Tags.SCIENCE]} as IProjectCard);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
    card.onCardPlayed(player, {tags: [Tags.SCIENCE, Tags.BUILDING, Tags.CITY]} as IProjectCard);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(4);
  });

  it('initialAction - chooses Venus which cannot be activated', () => {
    const venus = new Venus();
    game.colonyDealer!.discardedColonies.push(venus);
    const playerInput = card.initialAction(player) as SelectColony;
    expect(playerInput.coloniesModel.map((cm) => cm.name)).includes(venus.name);

    playerInput.cb((<any>ColonyName)[venus.name.toUpperCase()]);

    expect(game.colonies.map((c) => c.name)).includes(venus.name);
    expect(venus.isActive).is.false;
  });

  it('initialAction - chooses Venus which is activated', () => {
    player2.corporationCards = [new Celestic()];

    const venus = new Venus();
    game.colonyDealer!.discardedColonies.push(venus);
    const playerInput = card.initialAction(player) as SelectColony;
    expect(playerInput.coloniesModel.map((cm) => cm.name)).includes(venus.name);

    playerInput.cb((<any>ColonyName)[venus.name.toUpperCase()]);

    expect(game.colonies.map((c) => c.name)).includes(venus.name);
    expect(venus.isActive).is.true;
  });
});
