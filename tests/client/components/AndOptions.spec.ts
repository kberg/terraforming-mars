
import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';

import {expect} from 'chai';
import AndOptions from '@/client/components/AndOptions.vue';
import {InputResponse} from '@/common/inputs/InputResponse';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';

describe('AndOptions', () => {
  it('saves the options', async () => {
    let savedData: InputResponse | undefined;
    const component = mount(AndOptions, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        components: {
          'player-input-factory': PlayerInputFactory,
        },
      },
      props: {
        player: {
          id: 'foo',
        },
        playerinput: {
          title: 'foo',
          options: [{
            type: 'option',
            title: 'select a',
          }, {
            title: 'select b',
            type: 'option',
          }],
        },
        onsave: function(data: InputResponse) {
          savedData = data;
        },
        showsave: true,
        showtitle: true,
      },
    });
    const buttons = component.findAllComponents({name: 'AppButton'});
    await buttons[0].trigger('click');
    expect(savedData).to.deep.eq({type: 'and', responses: [{type: 'option'}, {type: 'option'}]});
  });
});
