import { FormInstance, Tabs } from 'antd'
import { MessageForm } from 'features/smsGenerator/messageModal/MessageForm'
import { PermissionInterface } from 'type'

interface IMessageTabsProps {
	langCodes: string[]
	form: FormInstance
	editPermission?: PermissionInterface
}

const MessageTabs = ({
	langCodes,
	form,
	editPermission,
}: IMessageTabsProps) => {
	const items = langCodes?.map(langCode => {
		return {
			label: langCode,
			key: langCode,
			children: (
				<MessageForm
					form={form}
					langCode={langCode}
					disabled={!editPermission?.canUse}
				/>
			),
		}
	})
	return <Tabs defaultActiveKey='1' type='card' items={items} />
}

export { MessageTabs }
