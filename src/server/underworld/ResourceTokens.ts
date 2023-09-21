import {ResourceTokenType} from './ResourceTokenType';

export type ResourceToken = Array<ResourceTokenType>;
const tokens: Array<ResourceToken> = [];

function add(count: number, ...tile: Array<ResourceTokenType>) {
  for (let idx = 0; idx < count; idx++) {
    tokens.push([...tile]);
  }
}

add(5); // nothing
add(13, 'data');
add(4, 'data', 'data');
add(1, 'data', 'data', 'data');

// 3 1 Data per Temperature increase

add(10, 'corruption');
add(2, 'corruption', 'corruption');

add(4, 'card');
add(1, 'card', 'card');

add(3, 'steel', 'steel');
add(1, 'steel production');

// 3 2 Steel per Temperature increase

add(3, 'titanium', 'plant');
add(3, 'titanium', 'titanium');
add(1, 'titanium production');

// 3 1 Titanium per Temperature increase

add(4, 'plant', 'plant');
add(1, 'plant', 'plant', 'plant');
add(4, 'plant production');

// 3 2 Plants per Temperature increase

add(5, 'energy production');
add(3, 'heat production', 'heat production');

add(4, 'microbe', 'microbe');

// 1 1 Microbe per Temperature increase

add(2, 'tr');
add(2, 'ocean');
