import { Parsimmon } from '../common/Dependency.ts';
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
	H1: Parsimmon.oneOf('#'),
	H2: Parsimmon.string('##'),
	H3: Parsimmon.string('###'),
	H4: Parsimmon.string('####'),
	H5: Parsimmon.string('#####'),
	H6: Parsimmon.string('######'),
	Bold1: Parsimmon.string('**'),
	Bold2: Parsimmon.string('__'),
	Italic1: Parsimmon.oneOf('*'),
	Italic2: Parsimmon.oneOf('_'),
};
const buildParseItalic = (pParser: any, pParseContent: any): any => {
	return Parsimmon.alt(
		Parsimmon.seq(
			Parsimmon.string('*'),
			pParseContent,
			Parsimmon.string('*')
		),
		Parsimmon.seq(
			Parsimmon.string('_'),
			pParseContent,
			Parsimmon.string('_')
		)
	);
};
const buildParseBold = (pParser: any, pParseContent: any): any => {
	return Parsimmon.alt(
		Parsimmon.seq(
			Parsimmon.string('**'),
			pParseContent,
			Parsimmon.string('**')
		),
		Parsimmon.seq(
			Parsimmon.string('__'),
			pParseContent,
			Parsimmon.string('__')
		)
	);
};

const tParser: Parsimmon.Language = Parsimmon.createLanguage({
	value(pParser: any) {
		return Parsimmon.alt(
			pParser.header6,
			pParser.header5,
			pParser.header4,
			pParser.header3,
			pParser.header2,
			pParser.header1,
			pParser.parseBold,
			pParser.parseItalic,
			pParser.parseText,
			pParser.parseRawText
		).many();
	},
	parseTokens() {
		return Parsimmon.alt(
			TOKEN.H6,
			TOKEN.H5,
			TOKEN.H4,
			TOKEN.H3,
			TOKEN.H2,
			TOKEN.H1,
			TOKEN.Bold1,
			TOKEN.Bold2,
			TOKEN.Italic1,
			TOKEN.Italic2
		);
	},
	parseEscape() {
		return Parsimmon.regexp(/\\(.)/, 1);
	},
	parseRawText() {
		return Parsimmon.regexp(/(.)/, 1)
			.atLeast(1)
			.map((x: any) => x.join(''));
	},
	parseText(pParser: any) {
		return Parsimmon.alt(
			pParser.parseEscape,
			Parsimmon.notFollowedBy(pParser.parseTokens)
		)
			.atLeast(1)
			.map((x: any) => x.join(''));
	},
	header1(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('# '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText.atLeast(1)
		);
	},
	header2(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('## '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText.atLeast(1)
		);
	},
	header3(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText.atLeast(1)
		);
	},
	header4(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('#### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText.atLeast(1)
		);
	},
	header5(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('##### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText.atLeast(1)
		);
	},
	header6(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('###### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText.atLeast(1)
		);
	},
	parseItalic(pParser: any) {
		return buildParseItalic(
			pParser,
			Parsimmon.alt(pParser.parseBold, pParser.parseText).atLeast(1)
		);
	},
	parseBold(pParser: any) {
		return buildParseBold(
			pParser,
			Parsimmon.alt(pParser.parseItalic, pParser.parseText).atLeast(1)
		);
	},
});

console.log(tParser.value.parse('# Header 1'));
console.log(tParser.value.parse('## Header 2'));
console.log(tParser.value.parse('### Header 3'));
console.log(tParser.value.parse('#### Header 4'));
console.log(tParser.value.parse('##### Header 5'));
console.log(tParser.value.parse('###### Header 6'));
console.log(tParser.value.parse('Simple text'));
console.log(tParser.value.parse('*italic text*'));
console.log(tParser.value.parse('_italic text_'));
console.log(tParser.value.parse('**bold text**'));
console.log(tParser.value.parse('__bold text__'));
console.log(tParser.value.parse('*sometext \\* test*'));
console.log(tParser.value.parse('*italic **bold** italic*'));
console.log(tParser.value.parse('**bold *italic* bold**'));
console.log(tParser.value.parse('__bold @ text__'));
console.log(tParser.value.parse('_italic @ text_'));
console.log(tParser.value.parse('__bold ~ text__'));
console.log(tParser.value.parse('_italic £ text_'));
console.log(tParser.value.parse('_italic \\* text_'));
console.log(tParser.value.parse('_italic \\_ text_'));
console.log(tParser.value.parse('#test'));
console.log(tParser.value.parse('test #test'));
// This parse is still a problem...
console.log(tParser.value.parse('_test #test_'));
