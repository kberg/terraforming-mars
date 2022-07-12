import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {Dealer} from '../../Dealer';
import {LogType} from '../../deferredActions/DrawCards';
import {LogHelper} from '../../LogHelper';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CorporationCard} from '../corporation/CorporationCard';
import {CARD_COST} from '../../constants';
import {Game} from '../../Game';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Size} from '../render/Size';

export class Merger extends PreludeCard {
  constructor() {
    super({
      name: CardName.MERGER,

      metadata: {
        cardNumber: 'X41',
        renderData: CardRenderer.builder((b) => {
          b.corporation().asterix().nbsp.megacredits(-42, Size.SMALL);
          b.br.br;
        }),
        description: 'Draw 4 corporation cards. Play one of them and discard the other 3. Then pay 42 M€.',
      },
    });
  }

  public mergerCost = 42;

  public play(player: Player) {
    const game = player.game;
    const dealtCorps = Merger.dealCorporationCards(player, game.dealer);

    const availableCorps = dealtCorps.filter((corp) => {
      const balance = this.mergerCost - (corp as CorporationCard).startingMegaCredits;
      return player.canAfford(balance);
    });

    if (availableCorps.length === 0) {
      return undefined;
    }

    game.defer(new DeferredAction(player, () => {
      return new SelectCard('Choose corporation card to play', 'Play', availableCorps, (foundCards: Array<IProjectCard>) => {
        Merger.playSecondCorporationCard(player, foundCards[0] as CorporationCard);
        return undefined;
      });
    }));

    game.defer(new SelectHowToPayDeferred(player, this.mergerCost, {title: 'Select how to pay for prelude'}));
    return undefined;
  }

  public static dealCorporationCards(player: Player, dealer: Dealer): IProjectCard[] {
    const cards: IProjectCard[] = [];
    const corpsInPlay = player.game.getPlayers().map((p) => p.corporationCards).reduce((a, b) => a.concat(b)).map((c) => c.name);

    let candidateCards = dealer.corporationCards.filter((card) => !corpsInPlay.includes(card.name));
    candidateCards = Dealer.shuffle(candidateCards);
    
    for (let i = 0; i < 4; i++) {
      cards.push(candidateCards.pop() as IProjectCard);
    }

    LogHelper.logDrawnCards(player, cards, true, LogType.DREW);
    return cards;
  }

  public static playSecondCorporationCard(player: Player, corporationCard: CorporationCard): void {
    player.corporationCards.push(corporationCard);
    player.megaCredits += corporationCard.startingMegaCredits;

    Merger.setCardCostIfNeeded(player, corporationCard);
    corporationCard.play(player);
    if (corporationCard.initialAction !== undefined) player.pendingInitialActions.push(corporationCard);
    player.game.log('${0} played ${1}', (b) => b.player(player).card(corporationCard));

    // trigger other corp's effect, e.g. SaturnSystems,PharmacyUnion,Splice
    Merger.triggerOtherCorpEffects(player, corporationCard);

    // Activate some colonies
    Merger.activateColonies(player.game, corporationCard);;
  }

  private static setCardCostIfNeeded(player: Player, corporationCard: CorporationCard): void {
    const corpNames = player.corporationCards.map((corp) => corp.name);

    if (corporationCard.cardCost !== undefined) {
      // Special case: If player has both Terralabs and Polyphemos, their cost effects cancel out
      if (corpNames.includes(CardName.TERRALABS_RESEARCH) && corpNames.includes(CardName.POLYPHEMOS)) {
        player.cardCost = CARD_COST;
      } else {
        player.cardCost = corporationCard.cardCost;
      }
    }
  }

  private static triggerOtherCorpEffects(player: Player, corporationCard: CorporationCard): void {
    for (const somePlayer of player.game.getPlayers()) {
      somePlayer.corporationCards.forEach((corp) => {
        if (corp.onCorpCardPlayed !== undefined && corp.name !== corporationCard.name) {
          player.game.defer(new DeferredAction(
            player,
            () => {
              if (corp.onCorpCardPlayed !== undefined) {
                return corp.onCorpCardPlayed(player, corporationCard) || undefined;
              }
              return undefined;
            },
          ));
        }
      });
    }
  }

  private static activateColonies(game: Game, corporationCard: CorporationCard): void {
    if (game.gameOptions.coloniesExtension && corporationCard.resourceType !== undefined) {
      game.colonies.forEach((colony) => {
        if (colony.resourceType !== undefined && colony.resourceType === corporationCard.resourceType) {
          colony.isActive = true;
        }
      });

      // Check for Venus colony
      game.activateVenusColony(corporationCard);
    }
  }
}
