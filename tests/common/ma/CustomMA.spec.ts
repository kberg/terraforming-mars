import {expect} from 'chai';
import {CustomMA, validateCustomMA} from '../../../src/common/ma/CustomMA';
import {RandomMAOptionType} from '../../../src/common/ma/RandomMAOptionType';
import {MilestoneName} from '../../../src/common/ma/MilestoneName';
import {AwardName} from '../../../src/common/ma/AwardName';

describe('CustomMA', () => {
  const customMA: CustomMA = {
    milestones: ['Terraformer', 'Gardener', 'Builder', 'Mayor', 'Planner'],
    awards: ['Banker', 'Scientist', 'Thermalist', 'Miner', 'Celebrity'],
  };
  const venusMA: CustomMA = {
    milestones: [...customMA.milestones, 'Hoverlord'],
    awards: [...customMA.awards, 'Venuphile'],
  };
  const MANUAL = RandomMAOptionType.MANUAL;

  it('valid', () => {
    expect(() => validateCustomMA(undefined, RandomMAOptionType.NONE, false)).to.not.throw();
    expect(() => validateCustomMA(customMA, MANUAL, false)).to.not.throw();
    expect(() => validateCustomMA(venusMA, MANUAL, true)).to.not.throw();
  });

  it('requires randomMA to be manual', () => {
    expect(() => validateCustomMA(customMA, RandomMAOptionType.NONE, false)).to.throw('Invalid milestone/award settings');
    expect(() => validateCustomMA(customMA, RandomMAOptionType.LIMITED, false)).to.throw('Invalid milestone/award settings');
    expect(() => validateCustomMA(undefined, MANUAL, false)).to.throw('No milestones and awards selected');
    // From untrusted JSON.
    expect(() => validateCustomMA(null as unknown as CustomMA, MANUAL, false)).to.throw('No milestones and awards selected');
  });

  it('requires arrays', () => {
    expect(() => validateCustomMA({milestones: customMA.milestones} as CustomMA, MANUAL, false)).to.throw('Selected milestones and awards must be lists');
    expect(() => validateCustomMA('foo' as unknown as CustomMA, MANUAL, false)).to.throw('Selected milestones and awards must be lists');
  });

  it('rejects unknown names', () => {
    expect(() => validateCustomMA({...customMA, milestones: ['Nope' as MilestoneName]}, MANUAL, false)).to.throw('Unknown milestone: Nope');
    expect(() => validateCustomMA({...customMA, awards: ['Nope' as AwardName]}, MANUAL, false)).to.throw('Unknown award: Nope');
  });

  it('rejects duplicates', () => {
    expect(() => validateCustomMA({...customMA, milestones: ['Terraformer', 'Terraformer']}, MANUAL, false)).to.throw('Duplicate milestones selected');
    expect(() => validateCustomMA({...customMA, awards: ['Banker', 'Banker']}, MANUAL, false)).to.throw('Duplicate awards selected');
  });

  it('size', () => {
    expect(() => validateCustomMA(venusMA, MANUAL, false)).to.throw('Must select 5 milestones');
    expect(() => validateCustomMA(customMA, MANUAL, true)).to.throw('Must select 6 milestones');
    expect(() => validateCustomMA({...customMA, awards: ['Banker']}, MANUAL, false)).to.throw('Must select 5 awards');
  });
});
