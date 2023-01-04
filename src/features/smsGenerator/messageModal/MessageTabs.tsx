import { FormInstance, Tabs } from 'antd'
import { MessageForm } from 'features/smsGenerator/messageModal/MessageForm'

interface IMessageTabsProps {
	langCodes: string[]
	form: FormInstance
}

const MessageTabs = ({ langCodes, form }: IMessageTabsProps) => {
	const items = langCodes?.map(langCode => {
		return {
			label: langCode,
			key: langCode,
			children: <MessageForm form={form} langCode={langCode} />,
		}
	})
	return <Tabs defaultActiveKey='1' type='card' items={items} />
}

export { MessageTabs }
