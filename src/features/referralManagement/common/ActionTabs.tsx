import { FC } from 'react'
import { FormInstance, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

import ActionTabPane from './ActionTabPane'

const ActionTabs: FC<{
	form: FormInstance<any>
}> = ({ form }) => {
	const userSite = useAppSelector(selectUserSite)

	return (
		<LayoutContent.Card>
			<Tabs type='card' style={{ height: 600 }}>
				{userSite?.iLangList.map(lang => {
					return <ActionTabPane lang={lang} form={form} key={lang} tab={lang} />
				})}
			</Tabs>
		</LayoutContent.Card>
	)
}

export default ActionTabs
