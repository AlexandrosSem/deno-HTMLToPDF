import { Parsimmon } from '../common/Dependency.ts';
const tParser: Parsimmon.Language = Parsimmon.createLanguage({
	value(pParser: any) {
		return Parsimmon.alt(
			pParser.header6,
			pParser.header5,
			pParser.header4,
			pParser.header3,
			pParser.header2,
			pParser.header1
		);
	},
	parseEscape() {
		return Parsimmon.seqMap(
			Parsimmon.oneOf('\\'),
			Parsimmon.any,
			(pSlash, pRest) => pRest
		);
	},
	parseText(pParser: any) {
		return Parsimmon.alt(pParser.parseEscape, Parsimmon.any)
			.many()
			.map((x: any) => x.join(''));
	},
	header1(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('# '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText
		);
	},
	header2(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('## '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText
		);
	},
	header3(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText
		);
	},
	header4(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('#### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText
		);
	},
	header5(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('##### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText
		);
	},
	header6(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.seqMap(Parsimmon.string('###### '), (pFirst: string) =>
				pFirst.trim()
			),
			pParser.parseText
		);
	},
});
const testText = `\# dsdsdsdsd`;
console.log(tParser.value.parse(testText));
