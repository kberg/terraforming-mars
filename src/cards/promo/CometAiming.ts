import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard, ICard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {HowToAffordRedsPolicy, ActionDetails, RedsPolicy} from '../../turmoil/RedsPolicy';
import {Units} from '../../Units';

export class CometAiming extends Card implements IActionCard, IProjectCard, IResourceCard {
  public howToAffordReds: HowToAffordRedsPolicy | undefined;

  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.COMET_AIMING,
      tags: [Tags.SPACE],
      cost: 17,
      resourceType: ResourceType.ASTEROID,

      metadata: {
        cardNumber: 'X16',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 1 asteroid resource to ANY CARD.', (eb) => {
            eb.titanium(1).startAction.asteroids(1).asterix();
          }).br;
          b.or().br;
          b.action('Remove 1 asteroid here to place an ocean.', (eb) => {
            eb.asteroids(1).startAction.oceans(1);
          });
        }),
      },
    });
  }
    public resourceCount = 0;

    public play() {
      return undefined;
    }

    public canAct(player: Player): boolean {
      const hasTitanium = player.titanium > 0;
      const oceansMaxed = player.game.noOceansAvailable();
      const canPlaceOcean = this.resourceCount > 0 && !oceansMaxed;
      const trGain = oceansMaxed ? 0 : 1;
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

      if (hasTitanium) Card.setRedsActionWarningText(player, trGain, this, redsAreRuling, 'place an ocean');

      if (oceansMaxed) {
        Card.setUselessActionWarningText(this, 'all oceans have already been placed');
      }

      if (redsAreRuling) {
        this.reserveUnits = Units.adjustUnits(this.reserveUnits, {megacredits: trGain * REDS_RULING_POLICY_COST});
        const actionDetails = this.getActionDetails();
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, player.game, actionDetails);

        if (this.howToAffordReds.mustSpendAtMost !== undefined || this.howToAffordReds.bonusMCFromPlay !== undefined) {
          this.reserveUnits = Units.maybeAdjustReservedMegacredits(player, this.reserveUnits, this.howToAffordReds);
        }

        return hasTitanium || (this.howToAffordReds.canAfford && canPlaceOcean);
      }

      return hasTitanium || canPlaceOcean;
    }

    public action(player: Player) {
      const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);

      const addAsteroidToSelf = function() {
        player.titanium--;
        player.addResourceTo(asteroidCards[0], {log: true});
        return undefined;
      };

      const addAsteroidToCard = new SelectCard(
        'Select card to add 1 asteroid',
        'Add asteroid',
        asteroidCards,
        (foundCards: Array<ICard>) => {
          player.titanium--;
          player.addResourceTo(foundCards[0], {log: true});
          return undefined;
        },
      );

      const spendAsteroidResource = () => {
        this.resourceCount--;
        LogHelper.logRemoveResource(player, this, 1, 'place an ocean');
        player.game.defer(new PlaceOceanTile(player));
        return undefined;
      };

      if (this.resourceCount === 0) {
        if (asteroidCards.length === 1) return addAsteroidToSelf();
        return addAsteroidToCard;
      }

      if (player.titanium === 0 && player.canAfford(this.reserveUnits.megacredits)) return spendAsteroidResource();

      const availableActions: Array<SelectOption | SelectCard<ICard>> = [];
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(this.reserveUnits.megacredits))) {
        availableActions.push(new SelectOption('Remove an asteroid resource to place an ocean', 'Remove asteroid', spendAsteroidResource));
      }

      if (asteroidCards.length === 1) {
        availableActions.push(new SelectOption('Spend 1 titanium to gain 1 asteroid resource', 'Spend titanium', addAsteroidToSelf));
      } else {
        availableActions.push(addAsteroidToCard);
      }

      if (availableActions.length === 1) {
        const action = availableActions[0];

        if (action instanceof SelectOption) return (availableActions[0] as SelectOption).cb();
        return availableActions[0]; // SelectCard
      }

      return new OrOptions(...availableActions);
    }

    public getActionDetails() {
      return new ActionDetails({oceansToPlace: 1});
    }
}
