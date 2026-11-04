import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import MilestonesAwardsPopup from '@/client/components/create/MilestonesAwardsPopup.vue';
import {CustomMA} from '@/common/ma/CustomMA';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';

// Stub that renders both named slots so template content is accessible in tests.
const PopupPanelStub = {
  name: 'PopupPanel',
  template: '<div><slot name="header"/><slot/></div>',
  emits: ['close'],
};

type Props = {
  randomMA: RandomMAOptionType;
  modularMA: boolean;
  includeFanMA: boolean;
  customMA: CustomMA | undefined;
  limit: number;
};

function mountPopup(props: Partial<Props> = {}) {
  return shallowMount(MilestonesAwardsPopup, {
    ...globalConfig,
    global: {
      ...globalConfig.global,
      stubs: {PopupPanel: PopupPanelStub},
    },
    props: {
      randomMA: RandomMAOptionType.MANUAL,
      modularMA: false,
      includeFanMA: false,
      customMA: {milestones: [], awards: []},
      limit: 5,
      ...props,
    },
  });
}

function checkbox(wrapper: ReturnType<typeof mountPopup>, name: string) {
  return wrapper.find(`input[type="checkbox"][value="${name}"]`);
}

describe('MilestonesAwardsPopup', () => {
  it('mounts without errors', () => {
    const wrapper = mountPopup();
    expect(wrapper.exists()).to.be.true;
  });

  it('checks the radio for the current mode', () => {
    const wrapper = mountPopup({randomMA: RandomMAOptionType.LIMITED, modularMA: true, customMA: undefined});
    expect((wrapper.find('#maMode-random-radio').element as HTMLInputElement).checked).is.true;
    expect((wrapper.find('#maMode-board-radio').element as HTMLInputElement).checked).is.false;
  });

  it('shows the list only when manual', () => {
    expect(checkbox(mountPopup(), 'Terraformer').exists()).is.true;
    expect(checkbox(mountPopup({randomMA: RandomMAOptionType.NONE, customMA: undefined}), 'Terraformer').exists()).is.false;
  });

  it('shows the source and synergy choices only for random', () => {
    const random = mountPopup({randomMA: RandomMAOptionType.UNLIMITED, customMA: undefined});
    expect(random.find('#maSource-official-radio').exists()).is.true;
    expect(random.find('#maSynergy-full-radio').exists()).is.true;
    const board = mountPopup({randomMA: RandomMAOptionType.NONE, customMA: undefined});
    expect(board.find('#maSource-official-radio').exists()).is.false;
    expect(board.find('#maSynergy-limited-radio').exists()).is.false;
    expect(mountPopup().find('#maSynergy-limited-radio').exists()).is.false;
  });

  it('labels the rows', () => {
    const headings = mountPopup({randomMA: RandomMAOptionType.LIMITED, customMA: undefined}).findAll('.create-game-ma-row-heading');
    expect(headings.map((h) => h.text())).deep.eq(['Type', 'Pool', 'Randomness']);
  });

  it('checks the radios for the current source and synergy', () => {
    const wrapper = mountPopup({randomMA: RandomMAOptionType.UNLIMITED, modularMA: true, customMA: undefined});
    expect((wrapper.find('#maSource-official-radio').element as HTMLInputElement).checked).is.true;
    expect((wrapper.find('#maSource-maps-radio').element as HTMLInputElement).checked).is.false;
    expect((wrapper.find('#maSynergy-full-radio').element as HTMLInputElement).checked).is.true;
    expect((wrapper.find('#maSynergy-limited-radio').element as HTMLInputElement).checked).is.false;
  });

  it('checks the radio for maps with fan maps', () => {
    const wrapper = mountPopup({randomMA: RandomMAOptionType.LIMITED, modularMA: false, includeFanMA: true, customMA: undefined});
    expect((wrapper.find('#maSource-maps-fan-radio').element as HTMLInputElement).checked).is.true;
    expect((wrapper.find('#maSource-maps-radio').element as HTMLInputElement).checked).is.false;
  });

  for (const run of [
    {id: 'official', modularMA: true, includeFanMA: false},
    {id: 'maps', modularMA: false, includeFanMA: false},
    {id: 'maps-fan', modularMA: false, includeFanMA: true},
  ] as const) {
    it(`choosing a source emits its options ${run.id}`, async () => {
      const wrapper = mountPopup({randomMA: RandomMAOptionType.LIMITED, customMA: undefined});
      await wrapper.find(`#maSource-${run.id}-radio`).trigger('change');
      expect(wrapper.emitted('update:modularMA')?.at(-1)).deep.eq([run.modularMA]);
      expect(wrapper.emitted('update:includeFanMA')?.at(-1)).deep.eq([run.includeFanMA]);
    });
  }

  it('choosing a synergy emits it', async () => {
    const wrapper = mountPopup({randomMA: RandomMAOptionType.LIMITED, customMA: undefined});
    await wrapper.find('#maSynergy-full-radio').trigger('change');
    expect(wrapper.emitted('update:randomMA')?.at(-1)).deep.eq([RandomMAOptionType.UNLIMITED]);
  });

  it('choosing random emits limited synergy from the maps', async () => {
    const wrapper = mountPopup();
    await wrapper.find('#maMode-random-radio').trigger('change');
    expect(wrapper.emitted('update:randomMA')?.at(-1)).deep.eq([RandomMAOptionType.LIMITED]);
    expect(wrapper.emitted('update:modularMA')?.at(-1)).deep.eq([false]);
    expect(wrapper.emitted('update:customMA')?.at(-1)).deep.eq([undefined]);
  });

  it('choosing board emits its options', async () => {
    const wrapper = mountPopup({randomMA: RandomMAOptionType.UNLIMITED, modularMA: true, customMA: undefined});
    await wrapper.find('#maMode-board-radio').trigger('change');
    expect(wrapper.emitted('update:randomMA')?.at(-1)).deep.eq([RandomMAOptionType.NONE]);
    expect(wrapper.emitted('update:modularMA')?.at(-1)).deep.eq([false]);
  });

  it('choosing manual restores the picks made while the popup is open', async () => {
    const wrapper = mountPopup({customMA: {milestones: ['Terraformer'], awards: []}});
    await wrapper.find('#maMode-board-radio').trigger('change');
    await wrapper.find('#maMode-manual-radio').trigger('change');
    expect(wrapper.emitted('update:randomMA')?.at(-1)).deep.eq([RandomMAOptionType.MANUAL]);
    expect(wrapper.emitted('update:customMA')?.at(-1)).deep.eq([{milestones: ['Terraformer'], awards: []}]);
  });

  it('checks the selected milestones and awards', () => {
    const wrapper = mountPopup({customMA: {milestones: ['Terraformer'], awards: ['Banker']}});
    expect((checkbox(wrapper, 'Terraformer').element as HTMLInputElement).checked).is.true;
    expect((checkbox(wrapper, 'Banker').element as HTMLInputElement).checked).is.true;
    expect((checkbox(wrapper, 'Mayor').element as HTMLInputElement).checked).is.false;
  });

  it('shows a trailing number in parentheses', () => {
    const wrapper = mountPopup();
    expect(checkbox(wrapper, 'Tactician4').element.closest('label')?.textContent?.replace(/\u00a0/g, ' ')).contains('Tactician (4)');
    expect(checkbox(wrapper, 'Tactician').element.closest('label')?.textContent).not.contains('(');
  });

  it('emits the selection when it changes', async () => {
    const wrapper = mountPopup({customMA: {milestones: ['Terraformer'], awards: []}});
    await checkbox(wrapper, 'Banker').setValue(true);
    expect(wrapper.emitted('update:customMA')?.at(-1)).deep.eq([{milestones: ['Terraformer'], awards: ['Banker']}]);
  });

  it('disables unselected items once the limit is reached', () => {
    const wrapper = mountPopup({customMA: {milestones: ['Terraformer', 'Mayor'], awards: []}, limit: 2});
    expect(checkbox(wrapper, 'Gardener').attributes('disabled')).is.not.undefined;
    expect(checkbox(wrapper, 'Mayor').attributes('disabled')).is.undefined;
    expect(checkbox(wrapper, 'Banker').attributes('disabled')).is.undefined;
  });
});
