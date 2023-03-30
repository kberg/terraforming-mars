import {ISpace} from '../boards/ISpace';
import {MarsCoalition} from '../cards/community/corporations/MarsCoalition';
import {IProjectCard} from '../cards/IProjectCard';
import {SOCIETY_ADDITIONAL_CARD_COST} from '../constants';
import {DiscardCards} from '../deferredActions/DiscardCards';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';
import {GlobalParameter} from '../GlobalParameter';
import {SelectOption} from '../inputs/SelectOption';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {Resources} from '../Resources';
import {GlobalEventDealer} from './globalEvents/GlobalEventDealer';
import {EMPOWER_POLICY_2} from './parties/Empower';
import {GREENS_POLICY_2, GREENS_POLICY_3} from './parties/Greens';
import {KELVINISTS_POLICY_4} from './parties/Kelvinists';
import {MARS_FIRST_POLICY_2} from './parties/MarsFirst';
import {PartyHooks} from './parties/PartyHooks';
import {PartyName} from './parties/PartyName';
import {POPULISTS_POLICY_2, POPULISTS_POLICY_4} from './parties/Populists';
import {REDS_POLICY_2} from './parties/Reds';
import {SPOME_POLICY_3} from './parties/Spome';
import {Turmoil} from './Turmoil';
import {TurmoilPolicy} from './TurmoilPolicy';

export class TurmoilHandler {
  private constructor() {}

  public static addPartyActionToActionsList(player: Player, policy: any, options: PlayerInput[], title: string = 'Pay'): void {
    if (policy.canAct(player)) {
      options.push(
        new SelectOption(
          policy.description,
          title,
          () => policy.action(player),
        ),
      );
    }
  }

  public static applyOnCardPlayedEffect(player: Player, selectedCard: IProjectCard): void {
    // PoliticalAgendas Greens P3 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.GREENS, TurmoilPolicy.GREENS_POLICY_3)) {
      const policy = GREENS_POLICY_3;
      policy.onCardPlayed(player, selectedCard);
    }

    // PoliticalAgendas MarsFirst P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.MARS, TurmoilPolicy.MARS_FIRST_POLICY_2)) {
      const policy = MARS_FIRST_POLICY_2;
      policy.onCardPlayed(player, selectedCard);
    }

    // PoliticalAgendas Populists P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.POPULISTS, TurmoilPolicy.POPULISTS_POLICY_2)) {
      const policy = POPULISTS_POLICY_2;
      policy.onCardPlayed(player, selectedCard);
    }
  }

  public static resolveTilePlacementCosts(player: Player): void {
    // PoliticalAgendas Reds P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, TurmoilPolicy.REDS_POLICY_2)) {
      const redsPolicy = REDS_POLICY_2;
      redsPolicy.onTilePlaced(player);
    }

    // PoliticalAgendas Spome P3 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.SPOME, TurmoilPolicy.SPOME_POLICY_3)) {
      const spomePolicy = SPOME_POLICY_3;
      spomePolicy.onTilePlaced(player);
    }
  }

  public static resolveTilePlacementBonuses(player: Player, space: ISpace): void {
    PartyHooks.applyMarsFirstRulingPolicy(player, space);

    // PoliticalAgendas Greens P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.GREENS, TurmoilPolicy.GREENS_POLICY_2)) {
      const greensPolicy = GREENS_POLICY_2;
      greensPolicy.onTilePlaced(player);
    }

    // PoliticalAgendas Kelvinists P4 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.KELVINISTS, TurmoilPolicy.KELVINISTS_POLICY_4)) {
      const kelvinistsPolicy = KELVINISTS_POLICY_4;
      kelvinistsPolicy.onTilePlaced(player);
    }

    // PoliticalAgendas Empower P2 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.EMPOWER, TurmoilPolicy.EMPOWER_POLICY_2)) {
      const empowerPolicy = EMPOWER_POLICY_2;
      empowerPolicy.onTilePlaced(player);
    }

    // PoliticalAgendas Populists P4 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.POPULISTS, TurmoilPolicy.POPULISTS_POLICY_4)) {
      const populistsPolicy = POPULISTS_POLICY_4;
      populistsPolicy.onTilePlaced(player);
    }
  }

  public static onGlobalParameterIncrease(player: Player, parameter: GlobalParameter, steps: number = 1): void {
    if (parameter === GlobalParameter.TEMPERATURE) {
      // PoliticalAgendas Kelvinists P2 hook
      if (PartyHooks.shouldApplyPolicy(player, PartyName.KELVINISTS, TurmoilPolicy.KELVINISTS_POLICY_2)) {
        player.addResource(Resources.MEGACREDITS, steps * 3);
      }
    }

    // PoliticalAgendas Reds P4 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS, TurmoilPolicy.REDS_POLICY_4)) {
      player.addProduction(Resources.MEGACREDITS, -1 * steps, {log: true});
    }

    // PoliticalAgendas Scientists P3 hook
    if (PartyHooks.shouldApplyPolicy(player, PartyName.SCIENTISTS, TurmoilPolicy.SCIENTISTS_POLICY_3)) {
      player.drawCard(steps);
      player.game.defer(new DiscardCards(player, steps, 'Turmoil Scientists - Select ' + steps + ' card(s) to discard'));
    }

    // PoliticalAgendas Spome P1 hook
    if (parameter === GlobalParameter.VENUS) {
      if (PartyHooks.shouldApplyPolicy(player, PartyName.SPOME, TurmoilPolicy.SPOME_DEFAULT_POLICY)) {
        player.addResource(Resources.MEGACREDITS, steps * 2);
      }
    }

    // Mars Coalition hook
    MarsCoalition.onGlobalParameterIncrease(player, parameter, steps);
  }

  public static handleSocietyPayment(player: Player, partyName: PartyName): void {
    const turmoil = player.game.turmoil;

    if (turmoil !== undefined && turmoil.parties.find((p) => p.name === partyName) === undefined) {
      player.game.defer(new SelectHowToPayDeferred(player, SOCIETY_ADDITIONAL_CARD_COST, {title: 'Society: Select how to pay for card'}));
    }
  }

  public static randomizeGlobalEventDelegates(turmoil: Turmoil, dealer: GlobalEventDealer): void {
    const topDelegates = turmoil.parties.map((party) => party.name).reduce((a, i) => a.concat(Array(10).fill(i)), [] as PartyName[]);
    const bottomDelegates = turmoil.parties.map((party) => party.name).reduce((a, i) => a.concat(Array(10).fill(i)), [] as PartyName[]);
    
    dealer.globalEventsDeck.forEach((event) => {
      event.currentDelegate = topDelegates.splice(Math.floor(Math.random() * topDelegates.length), 1)[0];
      event.revealedDelegate = bottomDelegates.splice(Math.floor(Math.random() * bottomDelegates.length), 1)[0];
    });
  }
}
