import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import MilestonesAwardsSelector from '@/client/components/create/MilestonesAwardsSelector.vue';
import MilestonesAwardsPopup from '@/client/components/create/MilestonesAwardsPopup.vue';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';

function mountSelector(randomMA: RandomMAOptionType, modularMA = false, includeFanMA = false) {
  return mount(MilestonesAwardsSelector, {
    ...globalConfig,
    props: {randomMA, modularMA, includeFanMA, customMA: undefined, limit: 5},
  });
}

describe('MilestonesAwardsSelector', () => {
  for (const run of [
    {randomMA: RandomMAOptionType.NONE, modularMA: false, includeFanMA: false, expected: 'Board'},
    {randomMA: RandomMAOptionType.LIMITED, modularMA: false, includeFanMA: false, expected: 'Random, Maps, Limited synergy'},
    {randomMA: RandomMAOptionType.UNLIMITED, modularMA: false, includeFanMA: true, expected: 'Random, Maps + Fan maps, Full random'},
    {randomMA: RandomMAOptionType.LIMITED, modularMA: true, includeFanMA: false, expected: 'Random, Official, Limited synergy'},
    {randomMA: RandomMAOptionType.UNLIMITED, modularMA: true, includeFanMA: false, expected: 'Random, Official, Full random'},
    {randomMA: RandomMAOptionType.MANUAL, modularMA: false, includeFanMA: false, expected: 'Manual'},
  ] as const) {
    it(`shows the mode on the button ${JSON.stringify(run)}`, () => {
      const wrapper = mountSelector(run.randomMA, run.modularMA, run.includeFanMA);
      expect(wrapper.find('label[for="maSelector-checkbox"]').text().replace(/\u00a0/g, ' ')).eq(`Milestones and Awards (${run.expected})`);
    });
  }

  it('opens the popup', async () => {
    const wrapper = mountSelector(RandomMAOptionType.NONE);
    expect(wrapper.findComponent(MilestonesAwardsPopup).exists()).is.false;
    await wrapper.find('#maSelector-checkbox').setValue(true);
    expect(wrapper.findComponent(MilestonesAwardsPopup).exists()).is.true;
  });
});
