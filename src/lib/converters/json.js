export default {
  name: 'JSON',
  parse: (input) => JSON.parse(input),
  stringify: (data) => JSON.stringify(data, null, 2),
};
