import { Dispatch, SetStateAction } from 'react'
import { Tabs, FormInstance } from 'antd'
import { isEmpty } from 'lodash'
import { Table } from 'components'
import PointLevelManagementTable from 'features/pointLevelManagement/PointLevelManagementTable'
import { IPointLevelData } from 'features/pointLevelManagement/type'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { LayoutContent } from 'app/pages/layout'

interface IPointLevelTabsProps {
	loading: boolean
	form: FormInstance
	pointLevelData: IPointLevelData[]
	editPermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onTabsChange: (TabsKey: string) => void
	onDeletePointLevel: (pointLevel: number) => void
	onRowSaved: () => void
}

const PointLevelManagementTabs = ({
	loading,
	form,
	pointLevelData,
	editPermission,
	editingKey,
	setEditingKey,
	onTabsChange,
	onDeletePointLevel,
	onRowSaved,
}: IPointLevelTabsProps) => {
	const currencyList = useAppSelector(selectCurrencyListBySite)
	return (
		<LayoutContent.Card>
			{!isEmpty(currencyList) ? (
				<Tabs
					type='card'
					tabBarStyle={{ margin: 0 }}
					onChange={onTabsChange}
					destroyInactiveTabPane
					items={currencyList?.map(item => {
						const { isoCode, currencyId } = item
						return {
							label: isoCode,
							key: String(currencyId),
							children: (
								<PointLevelManagementTable
									loading={loading}
									form={form}
									pointLevelData={pointLevelData}
									editPermission={editPermission}
									editingKey={editingKey}
									setEditingKey={setEditingKey}
									onDeletePointLevel={onDeletePointLevel}
									onRowSaved={onRowSaved}
								/>
							),
						}
					})}
				/>
			) : (
				/* 若沒有currency時顯示空table  */
				<Table />
			)}
		</LayoutContent.Card>
	)
}

export default PointLevelManagementTabs
