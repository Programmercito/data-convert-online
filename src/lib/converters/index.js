import json from './json';
import yaml from './yaml';
import xml from './xml';
import toml from './toml';
import jsonl from './jsonl';
import csv from './csv';
import toon from './toon';

export const converters = {
  json,
  yaml,
  xml,
  toml,
  jsonl,
  csv,
  toon,
};

export const convert = (input, from, to) => {
  try {
    const data = converters[from].parse(input);
    return converters[to].stringify(data);
  } catch (error) {
    throw new Error(`Conversion failed from ${from} to ${to}: ${error.message}`);
  }
};
