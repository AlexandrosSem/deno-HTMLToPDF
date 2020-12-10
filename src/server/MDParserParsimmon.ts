import { Parsimmon } from '../common/Dependency.ts';
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
			pParser.parseText
		).many();
	},
	parseEscape() {
		return Parsimmon.regexp(/\\(.)/, 1);
	},
	parseAnyExceptCrucial() {
		return Parsimmon.regexp(/([^\\#*_])/, 1);
	},
	parseText(pParser: any) {
		return Parsimmon.alt(pParser.parseEscape, pParser.parseAnyExceptCrucial)
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
console.log(tParser.value.parse('__bold @ text__'));
