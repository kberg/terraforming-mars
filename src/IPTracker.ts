import {PlayerId} from './Player';
import {IncomingMessage} from 'http';
import {deArray} from './utils/utils';

export interface IPTracker {
  addParticipant(participantId: PlayerId, ip: string): void;
  add(ip: string): void;
  toJSON(): any;
}

type Value = {
  count: number,
  participantIds: Set<PlayerId>;
}

class IPTrackerImpl implements IPTracker {
  private map = new Map<string, Value>();

  private get(k: string): Value {
    const v = this.map.get(k);
    if (v !== undefined) {
      return v;
    }
    return {count: 0, participantIds: new Set()};
  }

  public add(ip: string): void {
    const value = this.get(ip);
    value.count++;
    this.map.set(ip, value);
  }

  public addParticipant(participantId: PlayerId, ip: string): void {
    const value = this.get(ip);
    value.participantIds.add(participantId);
    this.map.set(ip, value);
  }

  public toJSON(): any {
    const json: any = {};
    this.map.forEach((v, k) => {
      json[k] = {
        count: v.count,
        ids: Array.from(v.participantIds),
      };
    });
    return json;
  }
}

export function newIPTracker(): IPTracker {
  return new IPTrackerImpl();
}

export function getHerokuIpAddress(req: IncomingMessage): string | undefined {
  const address = deArray(req.headers['x-forwarded-for']);
  if (address === undefined) return undefined;

  return address;
}
