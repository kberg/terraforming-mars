import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {SelectInitialCards} from '../../../src/server/inputs/SelectInitialCards';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';

describe('TerralabsResearch', function() {
  it('Should play', function() {
    const businessNetwork = new BusinessNetwork();
    const [game, player] = testGame(1, {skipInitialCardSelection: false, customCorporationsList: [CardName.TERRALABS_RESEARCH, CardName.HELION]});
    const pi = cast(player.getWaitingFor(), SelectInitialCards);
    const projectCards = cast(pi.options[1], SelectCard).cards;
    player.process({type: 'and', responses: [
      {type: 'card', cards: [CardName.TERRALABS_RESEARCH]},
      {type: 'card', cards: [projectCards[0].name, projectCards[1].name]},
    ]});

    // 14 starting MC - 1 for each card select at the start (total: 2)
    expect(player.megaCredits).to.eq(12);
    // 14 Solo TR - 1
    expect(player.getTerraformRating()).to.eq(13);

    player.popWaitingFor();
    player.playedCards.push(businessNetwork);
    expect(businessNetwork.action(player)).is.undefined;
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([action.cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(11);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
