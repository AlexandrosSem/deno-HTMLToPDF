import { P } from '../common/Dependency.ts';
const buildParseItalic = (pParser: any, pParseContent: any): any => {
	return P.alt(
		P.seq(P.string('*'), pParseContent, P.string('*')),
		P.seq(P.string('_'), pParseContent, P.string('_'))
	);
};
const buildParseBold = (pParser: any, pParseContent: any): any => {
	return P.alt(
		P.seq(P.string('**'), pParseContent, P.string('**')),
		P.seq(P.string('__'), pParseContent, P.string('__'))
	);
};

const tP: P.Language = P.createLanguage({
	v(pParser: any) {
		return P.alt(
			pParser.header6,
			pParser.header5,
			pParser.header4,
			pParser.header3,
			pParser.header2,
			pParser.header1,
			pParser.parseBold,
			pParser.parseItalic,
			pParser.parseCode,
			pParser.parseText,
			pParser.parseRawText
		).many();
	},
	parseEscape() {
		return P.regex(/\\(.)/u, 1);
	},
	parseAnyExcept() {
		return P.regex(/[^\\#*_`]/u);
	},
	parseRawText() {
		return P.regex(/./u)
			.atLeast(1)
			.map((x: any) => x.join(''));
	},
	parseText(pParser: any) {
		return P.alt(pParser.parseEscape, pParser.parseAnyExcept)
			.atLeast(1)
			.map((x: any) => x.join(''));
	},
	header1(pParser: any) {
		return P.seq(
			P.seqMap(P.string('# '), (pFirst: string) => pFirst.trim()),
			pParser.parseText.atLeast(1)
		);
	},
	header2(pParser: any) {
		return P.seq(
			P.seqMap(P.string('## '), (pFirst: string) => pFirst.trim()),
			pParser.parseText.atLeast(1)
		);
	},
	header3(pParser: any) {
		return P.seq(
			P.seqMap(P.string('### '), (pFirst: string) => pFirst.trim()),
			pParser.parseText.atLeast(1)
		);
	},
	header4(pParser: any) {
		return P.seq(
			P.seqMap(P.string('#### '), (pFirst: string) => pFirst.trim()),
			pParser.parseText.atLeast(1)
		);
	},
	header5(pParser: any) {
		return P.seq(
			P.seqMap(P.string('##### '), (pFirst: string) => pFirst.trim()),
			pParser.parseText.atLeast(1)
		);
	},
	header6(pParser: any) {
		return P.seq(
			P.seqMap(P.string('###### '), (pFirst: string) => pFirst.trim()),
			pParser.parseText.atLeast(1)
		);
	},
	parseItalic(pParser: any) {
		return buildParseItalic(
			pParser,
			P.alt(pParser.parseBold, pParser.parseText).atLeast(1)
		);
	},
	parseBold(pParser: any) {
		return buildParseBold(
			pParser,
			P.alt(pParser.parseItalic, pParser.parseText).atLeast(1)
		);
	},
	parseCode() {
		return P.alt(
			P.seq(
				P.regex(/(`{2})/u),
				P.regex(/([^`]([`]?[^`])*)/u),
				P.regex(/(`{2})/u)
			),
			P.seq(P.regex(/(`)/u), P.regex(/([^`]*)/u), P.regex(/(`)/u))
		).atLeast(1);
	},
});

console.log(tP.v.parse('# Header 1'));
console.log(tP.v.parse('## Header 2'));
console.log(tP.v.parse('### Header 3'));
console.log(tP.v.parse('#### Header 4'));
console.log(tP.v.parse('##### Header 5'));
console.log(tP.v.parse('###### Header 6'));
console.log(tP.v.parse('Simple text'));
console.log(tP.v.parse('*italic text*'));
console.log(tP.v.parse('_italic text_'));
console.log(tP.v.parse('**bold text**'));
console.log(tP.v.parse('__bold text__'));
console.log(tP.v.parse('*sometext \\* test*'));
console.log(tP.v.parse('*italic **bold** italic*'));
console.log(tP.v.parse('**bold *italic* bold**'));
console.log(tP.v.parse('__bold @ text__'));
console.log(tP.v.parse('_italic @ text_'));
console.log(tP.v.parse('__bold ~ text__'));
console.log(tP.v.parse('_italic £ text_'));
console.log(tP.v.parse('_italic \\* text_'));
console.log(tP.v.parse('_italic \\_ text_'));
console.log(tP.v.parse('#test'));
console.log(tP.v.parse('test #test'));
console.log(tP.v.parse('`test #test`'));
console.log(tP.v.parse('``test #test``'));
console.log(tP.v.parse('``test `#test``'));
console.log(tP.v.parse('``a`a`a``'));
// This parse is still a problem...
console.log(tP.v.parse('_test #test_'));
