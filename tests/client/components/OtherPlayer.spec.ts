import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import OtherPlayer from '@/client/components/OtherPlayer.vue';
import {fakePublicPlayerModel} from './testHelpers';

describe('OtherPlayer', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(OtherPlayer, {
      global: {
        ...globalConfig.global,
        mocks: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      },
      props: {
        player: fakePublicPlayerModel(),
        playerIndex: 0,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
