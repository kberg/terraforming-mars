import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {AltSecondaryTag} from '@/common/cards/render/AltSecondaryTag';
import {ICardRenderItem} from '@/common/cards/render/Types';
import {Tag} from '@/common/cards/Tag';

function makeItem(overrides: Partial<ICardRenderItem> & {type: CardRenderItemType}): ICardRenderItem {
  return {
    is: 'item',
    amount: 1,
    ...overrides,
  } as ICardRenderItem;
}

function mountItem(item: ICardRenderItem) {
  return mount(CardRenderItemComponent, {
    ...globalConfig,
    props: {item},
  });
}

describe('CardRenderItemComponent', () => {
  it('mounts without errors', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 3}));
    expect(wrapper.exists()).to.be.true;
  });

  it('renders innerText', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 1, innerText: '3'}));
    expect(wrapper.text()).to.include('3');
  });

  it('renders amountInside', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 5, amountInside: true}));
    expect(wrapper.text()).to.include('5');
  });

  it('renders clone symbol with grayscale', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 1, amountInside: true, clone: true}));
    const html = wrapper.html();
    expect(html).to.include('grayscale');
    expect(html).to.include('\u{1FA90}');
  });

  it('renders secondaryTag icon', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 1, secondaryTag: Tag.SPACE}));
    const tagDiv = wrapper.find('.card-icon.card-tag-space');
    expect(tagDiv.exists()).to.be.true;
  });

  it('does not render secondaryTag for oxygen', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 1, secondaryTag: AltSecondaryTag.OXYGEN}));
    const tagDiv = wrapper.find('.card-icon');
    expect(tagDiv.exists()).to.be.false;
  });

  it('renders plate text', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 1, isPlate: true, text: 'HELLO'}));
    expect(wrapper.text()).to.include('HELLO');
  });

  it('renders MULTIPLIER_WHITE as X', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MULTIPLIER_WHITE, amount: 1}));
    expect(wrapper.text()).to.include('X');
  });

  it('renders IGNORE_GLOBAL_REQUIREMENTS', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS, amount: 1}));
    expect(wrapper.find('.card-project-requirements').exists()).to.be.true;
    expect(wrapper.find('.card-x').exists()).to.be.true;
    expect(wrapper.find('.card-requirements').exists()).to.be.true;
    expect(wrapper.find('.card-requirements').text()).to.equal('Global Requirements');
  });

  it('renders SELF_REPLICATING', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.SELF_REPLICATING, amount: 1}));
    expect(wrapper.find('.card-resource.card-card').exists()).to.be.true;
    expect(wrapper.find('.cards-count').text()).to.equal('2');
    expect(wrapper.find('.card-icon-space').exists()).to.be.true;
    expect(wrapper.find('.card-icon-building').exists()).to.be.true;
  });

  it('renders COLONY_TILE', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.COLONY_TILE, amount: 1}));
    expect(wrapper.find('.card-colony-tile').exists()).to.be.true;
    expect(wrapper.find('.card-colony-tile').text()).to.equal('colony');
  });

  it('renders PRELUDE', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.PRELUDE, amount: 1}));
    expect(wrapper.find('.card-prelude-container').exists()).to.be.true;
    expect(wrapper.find('.card-prelude-icon').exists()).to.be.true;
    expect(wrapper.find('.card-prelude-icon').text()).to.equal('prel');
  });

  it('renders CORPORATION', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.CORPORATION, amount: 1}));
    expect(wrapper.find('.card-corporation-icon').exists()).to.be.true;
  });

  it('renders FIRST_PLAYER', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.FIRST_PLAYER, amount: 1}));
    expect(wrapper.find('.card-first-player-icon').exists()).to.be.true;
  });

  it('renders RULING_PARTY', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.RULING_PARTY, amount: 1}));
    expect(wrapper.find('.card-party-icon').exists()).to.be.true;
  });

  it('renders AWARD', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.AWARD, amount: 1}));
    expect(wrapper.find('.card-award-icon').exists()).to.be.true;
    expect(wrapper.find('.card-award-icon').text()).to.equal('award');
  });

  it('renders MILESTONE', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MILESTONE, amount: 1}));
    expect(wrapper.find('.card-award-icon').exists()).to.be.true;
    expect(wrapper.find('.card-award-icon').text()).to.equal('milestone');
  });

  it('renders VP', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.VP, amount: 1}));
    expect(wrapper.find('.card-vp-questionmark').exists()).to.be.true;
    expect(wrapper.find('.card-vp-questionmark').text()).to.equal('?');
  });

  it('renders MEGACREDITS with unknown amount as ?', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: undefined as any, showDigit: true}));
    expect(wrapper.text()).to.include('?');
  });

  it('renders cancelled TR with X', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.TR, amount: 1, cancelled: true}));
    expect(wrapper.find('.card-x').exists()).to.be.true;
    expect(wrapper.find('.card-x').text()).to.equal('x');
  });

  it('renders cancelled WILD with X', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.WILD, amount: 1, cancelled: true}));
    expect(wrapper.find('.card-x').exists()).to.be.true;
  });

  it('renders cancelled TRADE with X', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.TRADE, amount: 1, cancelled: true}));
    expect(wrapper.find('.card-x').exists()).to.be.true;
  });

  it('renders cancelled UNDERGROUND_RESOURCES with X', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.UNDERGROUND_RESOURCES, amount: 1, cancelled: true}));
    expect(wrapper.find('.card-x').exists()).to.be.true;
  });

  it('does not render cancelled X for non-cancellable types', () => {
    const wrapper = mountItem(makeItem({type: CardRenderItemType.MEGACREDITS, amount: 1, cancelled: true}));
    expect(wrapper.find('.card-x').exists()).to.be.false;
  });
});
