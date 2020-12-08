import { Arcsecond } from '../common/Dependency.ts';
const {
	choice,
	sequenceOf,
	str,
	many,
	many1,
	digit,
	letter,
	char,
	anyChar,
	between,
	possibly,
	whitespace,
	recursiveParser,
	anyCharExcept,
} = Arcsecond;

/// debug
const debugOutput = (type: string) => (x: any) => ({ type: type, value: x });

/// Builders
const buildParseHeader = (pNumber: number) => {
	const header = '#'.repeat(pNumber);
	return sequenceOf([str(`${header} `).map(() => header), parseText]).map(
		debugOutput(`h${pNumber}`)
	);
};

const buildBetween = (pParser: any) => between(pParser)(pParser);

const buildParseBold = (pParser: any) =>
	choice([
		buildBetween(str('**'))(pParser),
		buildBetween(str('__'))(pParser),
	]);

const buildParseItalic = (pParser: any) =>
	choice([
		buildBetween(char('*'))(pParser),
		buildBetween(char('_'))(pParser),
	]);

// const buildParseText = (pException: any) =>
// 	many1(
// 		choice([
// 			parseEscape,
// 			letter,
// 			digit,
// 			whitespace,
// 			...(pException ? [] : [anyCharExcept(pException)]),
// 		])
// 	)
// 		.map((x: any) => x.join(''))
// 		.map(debugOutput('text2'));

/// Helpers
const parseEscape = sequenceOf([char('\\'), anyChar]).map((x: any) => x[1]);
const parseText = many1(choice([parseEscape, letter, digit, whitespace]))
	.map((x: any) => x.join(''))
	.map(debugOutput('text'));

/// Parsers
const _ParseH1 = buildParseHeader(1);
const _ParseH2 = buildParseHeader(2);
const _ParseH3 = buildParseHeader(3);
const _ParseH4 = buildParseHeader(4);
const _ParseH5 = buildParseHeader(5);
const _ParseH6 = buildParseHeader(6);

const _ParseItalic = buildParseItalic(
	recursiveParser(() =>
		many1(choice([_ParseBold, parseText])).map(debugOutput('italic'))
	)
);

const _ParseBold = buildParseBold(
	recursiveParser(() =>
		many1(choice([_ParseItalic, parseText])).map(debugOutput('bold'))
	)
);

const _MDParser = choice([
	_ParseH6,
	_ParseH5,
	_ParseH4,
	_ParseH3,
	_ParseH2,
	_ParseH1,
	_ParseBold,
	_ParseItalic,
	parseText,
]);

const _FinalParser = many(_MDParser);

/// Maybe using a promise is not the best options here,
/// but it will allow to change the parse engine quite easy.
export function RunParser(pText: string): Promise<object> {
	return new Promise((resolve, reject) => {
		try {
			const parsed = _FinalParser.run(pText);
			resolve(parsed);
		} catch (ex) {
			reject(ex);
		}
	});
}

const testParse = (pString: string) => {
	const parsed = _FinalParser.run(pString);
	const lineLen = 50;
	console.log(`${pString} ${'-'.repeat(lineLen - (pString.length + 1))}`);
	console.log(JSON.stringify(parsed, void 0, '  '));
	console.log(`${'-'.repeat(lineLen)}`);
};

testParse('# test');
testParse('## test');
testParse('### test');
testParse('#### test');
testParse('##### test');
testParse('###### test');
testParse('test test');
testParse('*italic text*');
testParse('_italic text_');
testParse('**bold text**');
testParse('__bold text__');
testParse('*sometext \\* test*');
testParse('*italic **bold** italic*');
testParse('**bold *italic* bold**');
// This parse is still a problem...
testParse('__bold @ text__');
