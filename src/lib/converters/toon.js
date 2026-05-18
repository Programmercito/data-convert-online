import { decode, encode } from '@toon-format/toon';

export default {
  name: 'TOON',
  parse: (input) => decode(input),
  stringify: (data) => encode(data),
};
