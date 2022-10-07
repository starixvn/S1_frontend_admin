import { FC } from 'react'
import { FormInstance, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'

import ActionTabPane from './ActionTabPane'

const ActionTabs: FC<{
	languageList: string[]
	form: FormInstance
}> = ({ languageList, form }) => {
	const items = languageList?.map(lang => {
		return {
			label: lang,
			key: lang,
			children: <ActionTabPane lang={lang} form={form} />,
		}
	})
	return (
		<LayoutContent.Card>
			<Tabs type='card' style={{ height: 600 }} items={items} />
		</LayoutContent.Card>
	)
}

export default ActionTabs
