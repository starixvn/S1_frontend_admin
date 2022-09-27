import { Dispatch, FC, SetStateAction, useContext, useEffect } from 'react'
import { FormInstance, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { SnsManagementTable } from 'features/snsManagement/components/SnsManagementTable'
import { tableContext } from 'features/snsManagement/tableContext'
import { head } from 'lodash'

interface ISnsManagementTabProps {
	langCode: string[]
	snsManagementData: {}
	form: FormInstance
	setCurrentLang: Dispatch<SetStateAction<string | undefined>>
	currentLang: string | undefined
}

const SnsManagementTab: FC<ISnsManagementTabProps> = ({
	langCode,
	snsManagementData,
	form,
	setCurrentLang,
	currentLang,
}) => {
	const { loading, disabled } = useContext(tableContext)
	const getTableValues = (lang: string) => {
		let result: any
		Object.entries(snsManagementData).forEach(([key, value]) => {
			if (key === lang) {
				result = value
			}
		})
		return result
	}

	const items = langCode?.map(lang => {
		return {
			label: lang,
			key: lang,
			disabled,
			children: (
				<SnsManagementTable snsData={getTableValues(lang)} form={form} />
			),
		}
	})

	//  init lang
	useEffect(() => {
		if (!loading && !currentLang) {
			setCurrentLang(head(langCode) ?? '')
		}
	}, [loading])

	return (
		<LayoutContent.Card>
			<Tabs
				type='card'
				defaultActiveKey='1'
				onChange={lang => setCurrentLang(lang)}
				// 只要tabs隱藏就銷毀該table , 保持 dataSource 正常更新
				destroyInactiveTabPane
				items={items}
			/>
		</LayoutContent.Card>
	)
}

export { SnsManagementTab }
