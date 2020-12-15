// tP ---> main parser object
// pP ---> main parser object passed to each property function
import { P } from '../common/Dependency.ts';
const buildParseItalic = (pContent: any): any => {
	return P.alt(
		P.seq(P.string('*'), pContent, P.string('*')),
		P.seq(P.string('_'), pContent, P.string('_'))
	);
};
const buildParseBold = (pContent: any): any => {
	return P.alt(
		P.seq(P.string('**'), pContent, P.string('**')),
		P.seq(P.string('__'), pContent, P.string('__'))
	);
};

const tP: P.Language = P.createLanguage({
	v(pP: any) {
		return P.alt(
			pP.parseHeader6,
			pP.parseHeader5,
			pP.parseHeader4,
			pP.parseHeader3,
			pP.parseHeader2,
			pP.parseHeader1,
			pP.parseBold,
			pP.parseItalic,
			pP.parseCode,
			pP.parseText,
			pP.parseRawText
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
	parseText(pP: any) {
		return P.alt(pP.parseEscape, pP.parseAnyExcept)
			.atLeast(1)
			.map((x: any) => x.join(''));
	},
	parseHeader1(pP: any) {
		return P.seq(
			P.seqMap(P.string('# '), (pFirst: string) => pFirst.trim()),
			pP.parseText.atLeast(1)
		);
	},
	parseHeader2(pP: any) {
		return P.seq(
			P.seqMap(P.string('## '), (pFirst: string) => pFirst.trim()),
			pP.parseText.atLeast(1)
		);
	},
	parseHeader3(pP: any) {
		return P.seq(
			P.seqMap(P.string('### '), (pFirst: string) => pFirst.trim()),
			pP.parseText.atLeast(1)
		);
	},
	parseHeader4(pP: any) {
		return P.seq(
			P.seqMap(P.string('#### '), (pFirst: string) => pFirst.trim()),
			pP.parseText.atLeast(1)
		);
	},
	parseHeader5(pP: any) {
		return P.seq(
			P.seqMap(P.string('##### '), (pFirst: string) => pFirst.trim()),
			pP.parseText.atLeast(1)
		);
	},
	parseHeader6(pP: any) {
		return P.seq(
			P.seqMap(P.string('###### '), (pFirst: string) => pFirst.trim()),
			pP.parseText.atLeast(1)
		);
	},
	parseItalic(pP: any) {
		return buildParseItalic(P.alt(pP.parseBold, pP.parseText).atLeast(1));
	},
	parseBold(pP: any) {
		return buildParseBold(P.alt(pP.parseItalic, pP.parseText).atLeast(1));
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
