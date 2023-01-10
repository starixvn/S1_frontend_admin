import { FormInstance, Tabs } from 'antd'
import { PermissionInterface } from 'type'
import AnnouncementForm from 'features/announcement/announcementmodal/AnnouncementForm'

interface IAnnouncementTabsProps {
	langCodes: string[]
	form: FormInstance
	editPermission?: PermissionInterface
}

const AnnouncementTabs = ({
	langCodes,
	form,
	editPermission,
}: IAnnouncementTabsProps) => {
	const items = langCodes?.map(langCode => {
		return {
			label: langCode,
			key: langCode,
			children: (
				<AnnouncementForm
					form={form}
					langCode={langCode}
					disabled={!editPermission?.canUse}
				/>
			),
		}
	})

	return <Tabs defaultActiveKey='1' type='card' items={items} />
}

export default AnnouncementTabs
