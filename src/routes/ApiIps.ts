import * as http from 'http';
import {Handler} from './Handler';
import {IContext} from './IHandler';

export class ApiIps extends Handler {
  public static readonly INSTANCE = new ApiIps();
  private constructor() {
    super({validateServerId: true});
  }

  public get(_req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void {
    ctx.route.writeJson(res, ctx.ipTracker.toJSON(), 2);
  }
}
