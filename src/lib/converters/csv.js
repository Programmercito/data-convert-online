import Papa from 'papaparse';

export default {
  name: 'CSV',
  parse: (input) => {
    const result = Papa.parse(input, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });
    if (result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }
    return result.data;
  },
  stringify: (data) => {
    if (!Array.isArray(data)) {
        // If it's a single object, wrap it in an array
        data = [data];
    }
    return Papa.unparse(data);
  },
};
