import { FC } from 'react'
import { FormInstance, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'

import ActionTabPane from './ActionTabPane'

const ActionTabs: FC<{
	languageList: string[]
	form: FormInstance<any>
}> = ({ languageList, form }) => {
	return (
		<LayoutContent.Card>
			<Tabs type='card' style={{ height: 600 }}>
				{languageList.map(lang => {
					return <ActionTabPane lang={lang} form={form} key={lang} tab={lang} />
				})}
			</Tabs>
		</LayoutContent.Card>
	)
}

export default ActionTabs
