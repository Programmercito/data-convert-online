export default {
  name: 'JSONL',
  parse: (input) => {
    return input
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line));
  },
  stringify: (data) => {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return data.map((item) => JSON.stringify(item)).join('\n');
  },
};
