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
	everyCharUntil,
	skip,
	pipeParsers,
} = Arcsecond;

/// debug
const debugOutput = (type: string) => (x: any) => ({ type: type, value: x });

/// Tokens
interface iTOKEN {
	H1: any;
	H2: any;
	H3: any;
	H4: any;
	H5: any;
	H6: any;
	Bold1: any;
	Bold2: any;
	Italic1: any;
	Italic2: any;
}

const TOKEN: iTOKEN = {
	H1: char('#'),
	H2: str('##'),
	H3: str('###'),
	H4: str('####'),
	H5: str('#####'),
	H6: str('######'),
	Bold1: str('**'),
	Bold2: str('__'),
	Italic1: char('*'),
	Italic2: char('_'),
};

/// Builders
const buildParseHeader = (pNumber: number) => {
	const parser = TOKEN[`H${pNumber}` as keyof iTOKEN];
	return pipeParsers([parser, char(' '), parseText]).map(
		debugOutput(`h${pNumber}`)
	);
};

const buildBetween = (pParser: any) => between(pParser)(pParser);

const buildParseBold = (pParser: any) =>
	choice([
		buildBetween(TOKEN.Bold1)(pParser),
		buildBetween(TOKEN.Bold2)(pParser),
	]);

const buildParseItalic = (pParser: any) =>
	choice([
		buildBetween(TOKEN.Italic1)(pParser),
		buildBetween(TOKEN.Italic2)(pParser),
	]);

/// Helpers
const parseTokens = choice([
	TOKEN.H6,
	TOKEN.H5,
	TOKEN.H4,
	TOKEN.H3,
	TOKEN.H2,
	TOKEN.H1,
	TOKEN.Bold1,
	TOKEN.Bold2,
	TOKEN.Italic1,
	TOKEN.Italic2,
]);
const parseEscape = sequenceOf([char('\\'), anyChar]).map((x: any) => x[1]);
const parseRawText = many1(anyChar)
	.map((x: any) => x.join(''))
	.map(debugOutput('rawText'));
const parseText = many1(choice([parseEscape, anyCharExcept(parseTokens)]))
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
	parseRawText,
]);

const _FinalParser = many1(_MDParser);

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

testParse('# Header 1');
testParse('## Header 2');
testParse('### Header 3');
testParse('#### Header 4');
testParse('##### Header 5');
testParse('###### Header 6');
testParse('Simple text');
testParse('*italic text*');
testParse('_italic text_');
testParse('**bold text**');
testParse('__bold text__');
testParse('*sometext \\* test*');
testParse('*italic **bold** italic*');
testParse('**bold *italic* bold**');
testParse('__bold @ text__');
testParse('_italic @ text_');
testParse('__bold ~ text__');
testParse('_italic £ text_');
testParse('_italic \\* text_');
testParse('_italic \\_ text_');
testParse('#test');
testParse('test #test');
// This parse is still a problem...
testParse('_test #test_');
