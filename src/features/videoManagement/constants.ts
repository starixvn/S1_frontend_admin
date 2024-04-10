import { CurrencyEnum } from 'type'

export const LangObj: { [key: string]: number } = {
	en: 1,
	cs: 2,
	th: 3,
	id: 4,
	vn: 5,
	hi: 6,
	my: 7,
	bd: 8,
	kh: 9,
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
	kh,
}

// * 各幣別所支援的 語系
export const langIdsByCurrency: { [currency: number]: number[] } = {
	[CurrencyEnum.MYR]: [LangIdEnum.en, LangIdEnum.cs, LangIdEnum.my],
	[CurrencyEnum.THB]: [LangIdEnum.en, LangIdEnum.th],
	[CurrencyEnum.IDR]: [LangIdEnum.en, LangIdEnum.id],
	[CurrencyEnum.INR]: [LangIdEnum.en, LangIdEnum.hi],
	[CurrencyEnum.BDT]: [LangIdEnum.en, LangIdEnum.bd],
	[CurrencyEnum.CNY]: [LangIdEnum.en, LangIdEnum.cs],
	[CurrencyEnum.VND]: [LangIdEnum.en, LangIdEnum.vn],
	[CurrencyEnum.USD]: [LangIdEnum.en],
	// @ts-ignore
	[CurrencyEnum.USD]: [LangIdEnum.en, LangIdEnum.kh],
}

/**
 * @returns  根據 currencies 回傳支援的 langIds
 */
export const getLangIdsByCurrencies = (currencies: number[]) => {
	const result = currencies?.reduce((acc, cur) => {
		return Array.from(new Set([...acc, ...(langIdsByCurrency[cur] ?? [])]))
	}, [] as number[])
	return result
}
