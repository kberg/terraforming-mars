import Vue, {VNode} from 'vue';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerModel} from '../models/PlayerModel';
import {PlayerInputModel} from '../models/PlayerInputModel';

const TYPE_TO_COMPONENT_NAME: Map<PlayerInputTypes, string> = new Map([
  [PlayerInputTypes.AND_OPTIONS, 'and-options'],
  [PlayerInputTypes.SELECT_CARD, 'select-card'],
  [PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD, 'select-how-to-pay-for-project-card'],
  [PlayerInputTypes.SELECT_INITIAL_CARDS, 'select-initial-cards'],
  [PlayerInputTypes.OR_OPTIONS, 'or-options'],
  [PlayerInputTypes.SELECT_OPTION, 'select-option'],
  [PlayerInputTypes.SELECT_HOW_TO_PAY, 'select-how-to-pay'],
  [PlayerInputTypes.SELECT_SPACE, 'select-space'],
  [PlayerInputTypes.SELECT_PLAYER, 'select-player'],
  [PlayerInputTypes.SELECT_AMOUNT, 'select-amount'],
  [PlayerInputTypes.SELECT_DELEGATE, 'select-party-player'],
  [PlayerInputTypes.SELECT_PARTY_TO_SEND_DELEGATE, 'select-party-to-send-delegate'],
  [PlayerInputTypes.SELECT_COLONY, 'select-colony'],
  [PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE, 'select-production-to-lose'],
  [PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS, 'shift-ares-global-parameters'],
  [PlayerInputTypes.PLAYER_READY, 'player-ready'],
],
);
export class PlayerInputFactory {
  private getComponentName(inputType: PlayerInputTypes): string {
    const componentName = TYPE_TO_COMPONENT_NAME.get(inputType);
    if (componentName === undefined) {
      throw 'Unsupported input type: ' + inputType;
    }
    return componentName;
  }
  public getPlayerInput(
    createElement: typeof Vue.prototype.$createElement,
    players: Array<PlayerModel>,
    player: PlayerModel,
    playerinput: PlayerInputModel,
    onsave: (out: Array<Array<string>>) => void,
    showsave: boolean,
    showtitle: boolean): VNode {
    return createElement(this.getComponentName(playerinput.inputType), {
      attrs: {
        player, players, playerinput, showsave, showtitle, onsave,
      },
    });
  }
}

