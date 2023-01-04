import { isJSON } from 'common/utils'
import { IConvertJsonData, ILanguageData } from 'features/smsGenerator/type'

// S2C
// 根據原始資料取出 langCode 和 formValue
export const messagesResConverter = (message: string): IConvertJsonData[] => {
	const result: IConvertJsonData[] = []
	if (!isJSON(message)) return result

	const rawData = JSON.parse(message)
	Object.entries(rawData).forEach(([key, value]: [string, any]) => {
		const { Title = '', Content = '', PopupMessage = '' } = value ?? {}
		result.push({
			key,
			Title,
			Content,
			PopupMessage,
		})
	})

	return result
}

// C2S
// 轉換可供 update Api 使用的 messages
export const formMessageConverter = (messages: object): ILanguageData[] => {
	const result: ILanguageData[] = []
	Object.entries(messages).forEach(([key, value]: [string, any]) => {
		const { Title, Content, PopupMessage } = value ?? {}
		result.push({
			lang: key,
			message: {
				title: Title,
				content: Content,
				popupMessage: PopupMessage,
			},
		})
	})
	return result
}
