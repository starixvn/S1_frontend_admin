export enum CurrencyEnum {
	MYR = 2,
	USD,
	THB,
	CNY = 13,
	IDR = 15,
	VND = 51,
	INR = 61,
	BDT = 74,
}

// 因對應api返回小駝峰字串,故這邊enum皆為小駝峰
export enum LangIdEnum {
	en = 1,
	cs,
	th,
	id,
	vn,
	hi,
	my,
	bd,
}

export const LangObj: { [key: string]: number } = {
	en: 1,
	cs: 2,
	th: 3,
	id: 4,
	vn: 5,
	hi: 6,
	my: 7,
	bd: 8,
}
