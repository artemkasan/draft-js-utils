// @flow
const {describe, it} = global;
import expect from 'expect';
import {convertFromRaw} from 'draft-js';
import stateToMarkdown from '../stateToMarkdown';
import fs from 'fs';
import {join} from 'path';

// This separates the test cases in `data/test-cases.txt`.
const SEP = '\n\n>>';

let testCasesRaw = fs.readFileSync(
  join(__dirname, '..', '..', 'test', 'test-cases.txt'),
  'utf8',
);

let testCases = testCasesRaw
  .slice(2)
  .trim()
  .split(SEP)
  .map((text) => {
    let lines = text.split('\n');
    let [description, config] = lines.shift().split('|');
    description = description.trim();
    let options = config ? JSON.parse(config.trim()) : undefined;
    let state = JSON.parse(lines.shift());
    let markdown = lines.join('\n');
    return {description, state, markdown, options};
  });

describe('stateToMarkdown', () => {
  testCases.forEach((testCase) => {
    let {description, state, markdown, options} = testCase;
    it(`should render ${description}`, () => {
      let contentState = convertFromRaw(state);
      expect(stateToMarkdown(contentState, options)).toBe(markdown + '\n');
    });
  });

  it('should complex state ', () => {
    const state = {
      blocks: [
        {
          key: 't2vj',
          text: 'Sentence one',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [
            {offset: 3, length: 9, style: 'BOLD'},
            {offset: 10, length: 2, style: 'ITALIC'},
          ],
          entityRanges: [],
          data: {},
        },
        {
          key: 'dr3kp',
          text: 'Sentence t~~wo~~',
          type: 'ordered-list-item',
          depth: 0,
          inlineStyleRanges: [{offset: 3, length: 11, style: 'BOLD'}],
          entityRanges: [],
          data: {},
        },
        {
          key: '55sab',
          text: 'Sentence thr~~ee~~',
          type: 'ordered-list-item',
          depth: 0,
          inlineStyleRanges: [{offset: 2, length: 14, style: 'ITALIC'}],
          entityRanges: [],
          data: {},
        },
        {
          key: 'p4tl',
          text: 'Subsentence',
          type: 'ordered-list-item',
          depth: 1,
          inlineStyleRanges: [
            {offset: 2, length: 6, style: 'BOLD'},
            {offset: 2, length: 6, style: 'ITALIC'},
          ],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    };

    const expectedMarkdown = 'Sen**tence o*****ne***\n\
\n\
1. Sen**tence t~~wo**~~\n\
2. Se*ntence thr~~ee*~~\n\
    1. Su***bsente***nce\n';
    const contentState = convertFromRaw(state);
    const markdown = stateToMarkdown(contentState);
      expect(markdown).toBe(expectedMarkdown);
  });
});
