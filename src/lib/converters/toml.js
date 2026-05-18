import * as toml from 'smol-toml';

export default {
  name: 'TOML',
  parse: (input) => toml.parse(input),
  stringify: (data) => toml.stringify(data),
};
