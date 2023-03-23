import * as http from 'http';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiSpectator extends Handler {
  public static readonly INSTANCE = new ApiSpectator();

  private constructor() {
    super();
  }

  public get(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    const spectatorId = String(ctx.url.searchParams.get('id'));
    ctx.gameLoader.getBySpectatorId(spectatorId, (game) => {
      if (game === undefined) {
        ctx.route.notFound(req, res);
        return;
      }

      // We need to mask the player's password from spectators
      const spectatorModel = Server.getSpectatorModel(game);
      if (spectatorModel !== undefined) {
        spectatorModel.players.forEach((player) => {
          player.password = '[REDACTED]';
        });
      }

      ctx.route.writeJson(res, spectatorModel);
    });
  }
}
