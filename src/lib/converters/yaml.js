import yaml from 'js-yaml';

export default {
  name: 'YAML',
  parse: (input) => yaml.load(input),
  stringify: (data) => yaml.dump(data, { indent: 2 }),
};
