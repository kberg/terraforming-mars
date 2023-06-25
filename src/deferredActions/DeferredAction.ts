import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';

export enum Priority {
  SUPERPOWER = -1, // Legacy value that should not be further used.
  COST, // Cost of a blue card action. Must happen before the effects.
  OPPONENT_TRIGGER, // Any effect from one of your opponent's card that triggers during your turn.
  SPONSORED_ACADEMIES, // Same as DISCARD_BEFORE_DRAW, but Sponsored Academies must proc before Mars University
  PLACE_LAND_TILE, // For tile placement cards like Restricted Area, in case they can place on spaces that give cards
  DRAW_CARDS_SCIENCE, // For cards like Invention Contest which should draw before Mars U discard
  DISCARD_BEFORE_DRAW, // When you must discard before you can draw (e.g. Mars University)
  DRAW_CARDS,
  BUILD_COLONY,
  INCREASE_COLONY_TRACK,
  PLACE_OCEAN_TILE,
  DEFAULT, // Anything that doesn't fit into another category.
  LOSE_AS_MUCH_AS_POSSIBLE, // Effects that make you lose resource or production "as much as possible". Pharmacy Union, Mons.
  ATTACK_OPPONENT, // Effects that make your opponents lose resources or production.
  GAIN_RESOURCE_OR_PRODUCTION,
  PAY_TO_DRAW_CARDS, // Curiosity II and Faraday
  LOSE_RESOURCE_OR_PRODUCTION,
  DECREASE_COLONY_TRACK_AFTER_TRADE,
  DISCARD_CARDS,
}

export class DeferredAction {
  public queueId?: number;

  constructor(
    public player: Player,
    public execute: () => PlayerInput | undefined,
    public priority: Priority = Priority.DEFAULT,
  ) {}

  public static create(player: Player, priority: Priority, execute: () => PlayerInput | undefined): DeferredAction {
    return new DeferredAction(player, execute, priority);
  }
}
