import { Arcsecond } from '../common/Dependency.ts';

const {
	choice,
	sequenceOf,
	str,
	many,
	digit,
	letter,
	char,
	anyChar,
	between,
	possibly,
} = Arcsecond;

const parseEscape = sequenceOf([char('\\'), anyChar]).map((x: any) => x[1]);
const parseText = many(choice([parseEscape, anyChar])).map((x: any) =>
	x.join('')
);
const _ParseHeader1 = sequenceOf([str('# ').map(() => '#'), parseText]);
const _ParseHeader2 = sequenceOf([str('## ').map(() => '##'), parseText]);
const _ParseHeader3 = sequenceOf([str('### ').map(() => '###'), parseText]);
const _ParseHeader4 = sequenceOf([str('#### ').map(() => '####'), parseText]);

const _MDParser = choice([
	_ParseHeader4,
	_ParseHeader3,
	_ParseHeader2,
	_ParseHeader1,
]);

export const MDParser = _MDParser;
