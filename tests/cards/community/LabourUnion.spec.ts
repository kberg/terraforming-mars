import {expect} from 'chai';
import {AquiferStandardProject} from '../../../src/cards/base/standardProjects/AquiferStandardProject';
import {CityStandardProject} from '../../../src/cards/base/standardProjects/CityStandardProject';
import {LabourUnion} from '../../../src/cards/community/corporations/LabourUnion';
import { AirScrappingStandardProject } from '../../../src/cards/venusNext/AirScrappingStandardProject';
import { AirScrappingStandardProjectVariant } from '../../../src/cards/venusNext/AirScrappingStandardProjectVariant';
import {DiscardCards} from '../../../src/deferredActions/DiscardCards';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';

describe('LabourUnion', function() {
  let card : LabourUnion; let player : TestPlayer; let game: Game;

  beforeEach(() => {
    card = new LabourUnion();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);

    card.play();
    player.corporationCard = card;
  });

  it('Must discard down to 6 cards at generation end', function() {
    for (let i = 0; i < 10; i++) {
      player.cardsInHand.push(game.dealer.dealCard(game));
    }

    player.runProductionPhase();
    expect(game.deferredActions).has.lengthOf(1);

    const selectDiscard = game.deferredActions.peek()! as DiscardCards;
    expect(selectDiscard instanceof DiscardCards).is.true;
  });

  it('Standard projects cost 4 MC less', function() {
    const aquifer = new AquiferStandardProject();
    player.megaCredits = aquifer.cost - 4;
    expect(aquifer.canAct(player)).is.true;

    const city = new CityStandardProject();
    player.megaCredits = city.cost - 4;
    expect(city.canAct(player)).is.true;

    const venus = new AirScrappingStandardProject();
    player.megaCredits = 11;
    expect(venus.canAct(player)).is.true;

    const altVenus = new AirScrappingStandardProjectVariant();
    player.tagsForTest = {venus: 1};
    player.megaCredits = 10;
    expect(altVenus.canAct(player)).is.true;
  });
});
