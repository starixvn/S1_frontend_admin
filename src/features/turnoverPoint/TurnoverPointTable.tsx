import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Space, Table, Tabs, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { PermissionInterface } from '../../type'
import { EditableTableCell } from '../vipRebateManagement/vipRebateManagementTable/EditableTableCell'
import { IGetTurnoverPointSettingListData } from './type'

interface TurnoverPointTableInterface {
	loading: boolean
	onTabsChange: (TabsKey: string) => void
	currencyList: Currency[] | undefined
	editPermission?: PermissionInterface
	form: FormInstance<any>
	tabActiveKey?: string
	turnoverTableData: IGetTurnoverPointSettingListData[]
}

const TurnoverPointTable: FC<TurnoverPointTableInterface> = ({
	loading,
	onTabsChange,
	currencyList,
	editPermission,
	form,
	tabActiveKey,
	turnoverTableData,
}) => {
	const { t } = useTranslation()
	const { TabPane } = Tabs
	const columns = [{}]
	return (
		<LayoutContent.Card>
			<Tabs
				defaultActiveKey='1'
				onChange={onTabsChange}
				type='card'
				activeKey={tabActiveKey}
			>
				{currencyList?.map(item => (
					<TabPane tab={item.isoCode} key={item.currencyId}>
						<Table
							components={{
								body: {
									cell: EditableTableCell,
								},
							}}
							loading={loading}
							columns={columns}
							dataSource={turnoverTableData ?? []}
						/>
					</TabPane>
				))}
			</Tabs>
		</LayoutContent.Card>
	)
}

export { TurnoverPointTable }
