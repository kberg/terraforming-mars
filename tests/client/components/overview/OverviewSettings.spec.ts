import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import OverviewSettings from '@/client/components/overview/OverviewSettings.vue';

describe('OverviewSettings', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(OverviewSettings, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        mocks: {
          getVisibilityState: () => false,
          setVisibilityState: () => {},
          componentsVisibility: {tags_concise: false},
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
