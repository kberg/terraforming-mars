import * as http from 'http';
import {IGameLoader} from '../database/IGameLoader';
import {Route} from './Route';
import {IPTracker} from '../IPTracker';

export interface IHandler {
  processRequest(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): void;
}

export interface IContext {
  url: URL,
  ip: string,
  route: Route,
  serverId: string,
  gameLoader: IGameLoader,
  ipTracker: IPTracker,
};
