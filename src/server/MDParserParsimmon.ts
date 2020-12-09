import { Parsimmon } from '../common/Dependency.ts';
const buildParseItalic = (pParser: any, pChar: string): any => {
	return Parsimmon.seq(
		Parsimmon.string(pChar),
		Parsimmon.alt(
			buildParseBold(pParser, pChar),
			pParser.parseText
		).atLeast(1),
		Parsimmon.string(pChar)
	);
};
const buildParseBold = (pParser: any, pChar: string): any => {
	return Parsimmon.seq(
		Parsimmon.string(pChar),
		Parsimmon.alt(
			buildParseItalic(pParser, pChar),
			pParser.parseText
		).atLeast(1),
		Parsimmon.string(pChar)
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
			pParser.parseText
		).many();
	},
	parseEscape() {
		return Parsimmon.regexp(/\\(.)/, 1);
	},
	parseDigitLetterWhitespace() {
		return Parsimmon.regexp(/(\d|[a-zA-Z]|\s)/, 1);
	},
	parseText(pParser: any) {
		return Parsimmon.alt(
			pParser.parseEscape,
			pParser.parseDigitLetterWhitespace
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
		return Parsimmon.alt(
			buildParseItalic(pParser, '*'),
			buildParseItalic(pParser, '_')
		);
	},
	parseBold(pParser: any) {
		return Parsimmon.alt(
			buildParseBold(pParser, '**'),
			buildParseBold(pParser, '__')
		);
	},
});

console.log(tParser.value.parse('# test'));
console.log(tParser.value.parse('## test'));
console.log(tParser.value.parse('### test'));
console.log(tParser.value.parse('#### test'));
console.log(tParser.value.parse('##### test'));
console.log(tParser.value.parse('###### test'));
console.log(tParser.value.parse('test test'));
console.log(tParser.value.parse('*italic text*'));
console.log(tParser.value.parse('_italic text_'));
console.log(tParser.value.parse('**bold text**'));
console.log(tParser.value.parse('__bold text__'));
console.log(tParser.value.parse('*sometext \\* test*'));
console.log(tParser.value.parse('*italic **bold** italic*'));
console.log(tParser.value.parse('**bold *italic* bold**'));
// This parse is still a problem...
console.log(tParser.value.parse('__bold @ text__'));
