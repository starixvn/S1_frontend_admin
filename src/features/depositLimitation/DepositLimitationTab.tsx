import { Dispatch, FC, SetStateAction } from 'react'
import { FormInstance, Tabs } from 'antd'
import { Currency } from 'common/enum/type'
import { PermissionInterface } from 'type'
import { DepositLimitationTable } from 'features/depositLimitation/DepositLimitationTable'
import { IDepositTableData } from 'features/depositLimitation/type'

interface IDepositLimitationTabProps {
	loading: boolean
	currentCurrency: number
	form: FormInstance
	setCurrentCurrency: Dispatch<SetStateAction<number>>
	currencyListBySite: Currency[]
	editPermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onTableRowSave: (record: IDepositTableData) => void
	onTableRowDelete: (record: IDepositTableData) => void
	tableDataSource: IDepositTableData[]
	onUpdateStatus: ({
		record,
		status,
		depositType,
	}: {
		record: IDepositTableData
		status: boolean
		depositType: number
	}) => void
}

const { TabPane } = Tabs

const DepositLimitationTab: FC<IDepositLimitationTabProps> = ({
	loading,
	currentCurrency,
	form,
	setCurrentCurrency,
	currencyListBySite,
	editPermission,
	editingKey,
	setEditingKey,
	onTableRowSave,
	onTableRowDelete,
	tableDataSource,
	onUpdateStatus,
}) => {
	const handleTabsChange = (currency: string) => {
		form.resetFields()
		setEditingKey(undefined)
		setCurrentCurrency(Number(currency))
	}

	return (
		<Tabs
			type='card'
			activeKey={String(currentCurrency)}
			destroyInactiveTabPane
			tabBarStyle={{ margin: 0 }}
			onChange={(value: string) => handleTabsChange(value)}
		>
			{currencyListBySite?.map(currency => {
				const { isoCode, currencyId } = currency
				return (
					<TabPane tab={isoCode} key={currencyId}>
						<DepositLimitationTable
							form={form}
							loading={loading}
							editingKey={editingKey}
							setEditingKey={setEditingKey}
							editPermission={editPermission}
							tableDataSource={tableDataSource}
							onTableRowDelete={onTableRowDelete}
							onTableRowSave={onTableRowSave}
							onUpdateStatus={onUpdateStatus}
						/>
					</TabPane>
				)
			})}
		</Tabs>
	)
}

export { DepositLimitationTab }
