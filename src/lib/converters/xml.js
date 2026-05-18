import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
});

export default {
  name: 'XML',
  parse: (input) => {
    const result = parser.parse(input);
    // If the input is just a string or empty, fast-xml-parser might return something unexpected
    if (Object.keys(result).length === 0 && input.trim() !== '') {
        throw new Error('Invalid XML or empty structure');
    }
    return result;
  },
  stringify: (data) => {
    // XML needs a root element if it doesn't have one
    let toBuild = data;
    if (typeof data === 'object' && Object.keys(data).length > 1) {
        toBuild = { root: data };
    }
    return builder.build(toBuild);
  },
};
