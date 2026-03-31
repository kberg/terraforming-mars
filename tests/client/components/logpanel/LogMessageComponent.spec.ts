import {mount, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import {fakeViewModel} from '../testHelpers';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {CardName} from '@/common/cards/CardName';

describe('LogMessageComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message: new LogMessage(LogMessageType.DEFAULT, 'Test message', []),
        viewModel: fakeViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders CARD type as a single card span', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARD, value: CardName.ANTS},
    ]);
    const wrapper = mount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardSpans = wrapper.findAll('.log-card');
    expect(cardSpans).to.have.length(1);
    expect(cardSpans[0].text()).to.equal('Ants');
  });

  it('renders CARDS type as multiple card spans', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARDS, value: [CardName.ANTS, CardName.ECOLINE]},
    ]);
    const wrapper = mount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardSpans = wrapper.findAll('.log-card');
    expect(cardSpans).to.have.length(2);
    expect(cardSpans[0].text()).to.equal('Ants');
    expect(cardSpans[1].text()).to.equal('Ecoline');
  });

  it('renders card with correct type CSS class', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARD, value: CardName.ANTS},
    ]);
    const wrapper = mount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardSpan = wrapper.find('.log-card');
    expect(cardSpan.classes()).to.include('background-color-active');
  });

  it('renders card with tags when attrs.tags is true', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARD, value: CardName.ANTS, attrs: {tags: true}},
    ]);
    const wrapper = mount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const tagDivs = wrapper.findAll('.log-tag');
    expect(tagDivs).to.have.length(1);
    expect(tagDivs[0].classes()).to.include('tag-microbe');
  });

  it('renders card with cost when attrs.cost is true', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARD, value: CardName.ANTS, attrs: {cost: true}},
    ]);
    const wrapper = mount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const costDiv = wrapper.find('.log-resource-megacredits');
    expect(costDiv.exists()).to.be.true;
    expect(costDiv.text()).to.equal('9');
  });

  it('renders cards ellipsis when attrs.ellipsis is true', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARDS, value: [CardName.ANTS, CardName.ECOLINE], attrs: {ellipsis: true}},
    ]);
    const wrapper = mount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardSpans = wrapper.findAll('.log-card');
    expect(cardSpans).to.have.length(1);
    expect(cardSpans[0].text()).to.equal('...');
  });
});
