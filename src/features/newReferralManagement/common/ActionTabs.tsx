import { FormInstance, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'

import ActionTabsPane from 'features/newReferralManagement/common/ActionTabsPane'

interface IActionTabsProps {
	form: FormInstance
	languageList: string[]
}

const ActionTabs = ({ form, languageList }: IActionTabsProps) => {
	const items = languageList?.map(lang => {
		return {
			label: lang,
			key: lang,
			children: <ActionTabsPane lang={lang} form={form} />,
		}
	})

	return (
		<LayoutContent.Card>
			<Tabs type='card' style={{ height: 600 }} items={items} />
		</LayoutContent.Card>
	)
}

export default ActionTabs
