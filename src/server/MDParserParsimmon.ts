import { Parsimmon } from '../common/Dependency.ts';
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
	parseItalic(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.string('*'),
			pParser.parseText,
			Parsimmon.string('*')
		);
	},
	parseBold(pParser: any) {
		return Parsimmon.seq(
			Parsimmon.string('**'),
			pParser.parseText,
			Parsimmon.string('**')
		);
	},
});
console.log(tParser.value.parse(` *344sdfsd \\fdfsdfsdfsd44*    `));
console.log(tParser.value.parse(`*344sdfsdfdfsdfsdfsd44*    *sdfdfsfs*`));
console.log(tParser.value.parse(`**344sdfsd fdfsdfsdfsd44**`));
console.log(tParser.value.parse(`*344sdfs**df**dfsdfsdfsd44*`));
console.log(tParser.value.parse(`**344sdfs*df*dfsdfsdfsd44**`));
