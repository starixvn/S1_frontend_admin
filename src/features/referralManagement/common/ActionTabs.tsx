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
					return (
						<ActionTabPane
							lang={lang}
							form={form}
							key={lang}
							tab={lang}
							// * TabPane 裡有 Form.Item，而 Form 表單只會送出 mounted 的 Form.Item
							// * 故需加上 forceRender 使所有 Tab Form Item 初始就全部渲染出來
							forceRender
						/>
					)
				})}
			</Tabs>
		</LayoutContent.Card>
	)
}

export default ActionTabs
