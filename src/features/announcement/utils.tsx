import {
	StatusTypeEnum,
	IsTestTypeEnum,
	IConvertSubjectJsonData,
	IConvertContentJsonData,
	ILangCodeData,
} from 'features/announcement/type'
import { isJSON } from 'common/utils'

// S2C
// 根據原始資料取出 langCode 和 formValue
export const announcementSubjectResConverter = (
	subject: string
): IConvertSubjectJsonData[] => {
	const result: IConvertSubjectJsonData[] = []
	if (!isJSON(subject)) return result
	const rawData = JSON.parse(subject)
	Object.entries(rawData).forEach(([key, value]: [string, any]) => {
		result.push({
			key,
			subject: value,
		})
	})
	return result
}

export const announcementContentResConverter = (
	content: string
): IConvertContentJsonData[] => {
	const result: IConvertContentJsonData[] = []
	if (!isJSON(content)) return result
	const rawData = JSON.parse(content)
	Object.entries(rawData).forEach(([key, value]: [string, any]) => {
		result.push({
			key,
			content: value,
		})
	})
	return result
}

// C2S
// 轉換可供 update Api 和 Add Api 使用的格式
export const announcementConvert = (subjectOrContent: object): string => {
	const result: ILangCodeData = {}
	Object.entries(subjectOrContent).forEach(([key, value]: [string, any]) => {
		const { subject: subjects = '', content: contents = '' } = value ?? {}
		if (subjects) {
			result[key] = subjects
		} else {
			result[key] = contents
		}
	})

	return JSON.stringify(result)
}

// 用於符合 update、add api 的格式
export const statusConverter = (status: boolean) => {
	return status
		? (StatusTypeEnum.true as number)
		: (StatusTypeEnum.false as number)
}

// 用於符合 update、add api 的格式
export const isTestConverter = (isTest: boolean) => {
	return isTest
		? (IsTestTypeEnum.true as number)
		: (IsTestTypeEnum.false as number)
}
