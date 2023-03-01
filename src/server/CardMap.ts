import {CardName} from '@/common/cards/CardName';
import {ICard} from './cards/ICard';

export interface Arrayish<T> {
  push(...cards: Array<T>): void;
  filter<S extends T>(predicate:(value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
  filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
  some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
}

export interface CardMap<T extends ICard> extends Arrayish<T> {
  get(cardName: CardName): T | undefined;
  has(cardName: CardName): boolean;
  delete(cardName: CardName): boolean;
  get size(): number;
  values(): ReadonlyArray<T>;
  clear(): void;
}

class CardMapImpl<T extends ICard> implements CardMap<T> {
  private map: Map<CardName, T> = new Map();
  private array: Array<T> = [];

  public push(card: T): void {
    this.map.set(card.name, card);
    this.array.push(card);
  }

  public some(predicate:(value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
    return this.array.some(predicate, thisArg);
  }

  public filter<S extends T>(predicate:(value: T) => value is S, thisArg?: any): S[] {
    return this.array.filter(predicate, thisArg);
  }

  public get(cardName: CardName): T | undefined {
    return this.map.get(cardName);
  }

  public has(cardName: CardName): boolean {
    return this.map.has(cardName);
  }

  public delete(cardName: CardName): boolean {
    // Inefficient. But that's acceptable.
    this.array = this.array.filter((c) => c.name !== cardName);
    return this.map.delete(cardName);
  }

  public get size(): number {
    return this.array.length;
  }

  public values(): ReadonlyArray<T> {
    return this.array;
  }

  public clear(): void {
    this.array.length = 0;
    this.map.clear();
  }
}

export function newCardMap <T extends ICard>(): CardMapImpl<T> {
  return new CardMapImpl<T>();
}
