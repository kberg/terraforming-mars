import {IPlayer} from '../IPlayer';
import {Resource} from '../../common/Resource';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {DeferredAction, Priority} from './DeferredAction';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';

export type Options = {
  count: number,
  stealing?: boolean
}

export class DecreaseAnyProduction extends DeferredAction<boolean> {
  constructor(
    player: IPlayer,
    public resource: Resource,
    public options: Options = {
      count: 1,
      stealing: false,
    },
    public title: string = 'Select player to decrease ' + resource + ' production by ' + options.count + ' step(s)',
  ) {
    super(player, Priority.ATTACK_OPPONENT);
  }

  private attack(target: IPlayer) {
    return UnderworldExpansion.mayBlockAttack(target, this.player, (proceed: boolean) => {
      if (proceed) {
        target.production.add(this.resource, -this.options.count, {log: true, from: this.player, stealing: this.options.stealing});
        return undefined;
      }
      this.cb(proceed);
    });
  }

  public execute() {
    if (this.player.game.isSoloMode()) {
      this.player.resolveInsuranceInSoloGame();
    } else {
      const targets = this.player.game.getPlayers().filter((p) => p.canHaveProductionReduced(this.resource, this.options.count, this.player));

      if (targets.length > 0) {
        if (targets.length > 1 || targets[0] === this.player) {
          return new SelectPlayer(
            targets,
            this.title,
            'Decrease',
            (target: IPlayer) => {
              this.attack(target);
              return undefined;
            },
          );
        } else {
          this.attack(targets[0]);
        }
      }
    }

    this.cb(true);
    return undefined;
  }
}
