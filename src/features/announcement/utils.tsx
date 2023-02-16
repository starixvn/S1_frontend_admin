import { ILangCodeData, IConvertJsonData } from 'features/announcement/type'
import { isJSON } from 'common/utils'

// S2C
// 根據原始資料取出 langCode 和 formValue

export const announcementResConverter = (
	subjectOrContent: string,
	type: string
): IConvertJsonData[] => {
	const result: IConvertJsonData[] = []
	if (!isJSON(subjectOrContent)) return result
	const rawData = JSON.parse(subjectOrContent)

	if (type === 'subject') {
		Object.entries(rawData).forEach(([key, value]: [string, any]) => {
			result.push({
				key,
				subject: value,
			})
		})
	} else {
		Object.entries(rawData).forEach(([key, value]: [string, any]) => {
			result.push({
				key,
				content: value,
			})
		})
	}
	return result
}

// C2S
// 轉換可供 update Api 和 add Api 使用的格式
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
