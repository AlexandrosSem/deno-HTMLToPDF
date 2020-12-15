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
	tapParser,
	lookAhead,
	regex,
} = Arcsecond;

/// debug
const DebugOutput = (type: string) => (x: any) => ({ type: type, value: x });

/// Tokens (Only needed because we need the `as keyof iTOKEN` for type-script)
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
const _Header = (n: number) => {
	const parser = TOKEN[`H${n}` as keyof iTOKEN];
	return pipeParsers([parser, char(' '), ParseText]).map(
		DebugOutput(`h${n}`)
	);
};

const _CharEx = (ex: any) => anyCharExcept(ex).map(DebugOutput('rawCharEx'));

const _Between = (left: any) => (right: any) => (parse: any) =>
	sequenceOf([left, parse, right]).map((x: any) => x[1]);

/// Helpers
const ParseTokens = choice([
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
const ParseEscape = sequenceOf([char('\\'), anyChar]).map((x: any) => x[1]);
const ParseText = many1(choice([ParseEscape, anyCharExcept(ParseTokens)]))
	.map((x: any) => x.join(''))
	.map(DebugOutput('text'));
const ParseRawChar = anyChar.map(DebugOutput('rawChar'));

/// Parsers
const ParseH1 = _Header(1);
const ParseH2 = _Header(2);
const ParseH3 = _Header(3);
const ParseH4 = _Header(4);
const ParseH5 = _Header(5);
const ParseH6 = _Header(6);

const ParseItalic = recursiveParser(() => {
	const _Row = (edge: any) => {
		const notSpace = lookAhead(regex(/^[^\s]/));
		const left = sequenceOf([edge, notSpace]);
		const right = sequenceOf([notSpace, edge]);
		return _Between(left)(right)(
			many1(choice([ParseBold, ParseText, _CharEx(edge)])).map(
				DebugOutput('italic')
			)
		);
	};
	return choice([_Row(TOKEN.Italic1), _Row(TOKEN.Italic2)]);
});

const ParseBold = recursiveParser(() => {
	const _Row = (edge: any) => {
		const notSpace = lookAhead(regex(/^[^\s]/));
		const left = sequenceOf([edge, notSpace]);
		const right = sequenceOf([notSpace, edge]);
		return _Between(left)(right)(
			many1(choice([ParseItalic, ParseText, _CharEx(edge)])).map(
				DebugOutput('bold')
			)
		);
	};
	return choice([_Row(TOKEN.Bold1), _Row(TOKEN.Bold2)]);
});

/// Markdown Parser
const MDParser = choice([
	ParseH6,
	ParseH5,
	ParseH4,
	ParseH3,
	ParseH2,
	ParseH1,
	ParseBold,
	ParseItalic,
	ParseText,
	ParseRawChar,
]);

const FinalParser = many1(MDParser);

/// Maybe using a promise is not the best options here,
/// but it will allow to change the parse engine quite easy.
export function RunParser(pText: string): Promise<object> {
	return new Promise((resolve, reject) => {
		try {
			const parsed = FinalParser.run(pText);
			resolve(parsed);
		} catch (ex) {
			reject(ex);
		}
	});
}

const testParse = (pString: string) => {
	const parsed = FinalParser.run(pString);
	const { isError, result } = parsed;
	const lineLen = 50;
	console.log(`${pString} ${'-'.repeat(lineLen - (pString.length + 1))}`);
	if (!isError) {
		console.log(result);
		// console.log(JSON.stringify(parsed, void 0, '  '));
	} else {
		console.log('ERROR: ');
		console.log(JSON.stringify(parsed, void 0, '  '));
	}
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
testParse('_test #test_');
// Extreme case (still a problem?! Should be expected?!)
testParse('text _iii _ text');
