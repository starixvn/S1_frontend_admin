import { Dispatch, FC, SetStateAction } from 'react'
import { FormInstance, Tabs } from 'antd'
import { Currency } from 'common/enum/type'
import { WithdrawalLimitationTable } from 'features/withdrawalLimitation/WithdrawalLimitationTable'
import { PermissionInterface } from 'type'
import { IWithdrawalLimitationTableData } from 'features/withdrawalLimitation/type'

interface IWithdrawalLimitationTabProps {
	loading: boolean
	currentCurrency: number
	form: FormInstance
	setCurrentCurrency: Dispatch<SetStateAction<number>>
	currencyListBySite: Currency[]
	editPermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onTableRowSave: (record: IWithdrawalLimitationTableData) => void
	withdrawalTableData: IWithdrawalLimitationTableData[]
}

const { TabPane } = Tabs

const WithdrawalLimitationTab: FC<IWithdrawalLimitationTabProps> = ({
	loading,
	currentCurrency,
	form,
	setCurrentCurrency,
	currencyListBySite,
	editPermission,
	editingKey,
	setEditingKey,
	onTableRowSave,
	withdrawalTableData,
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
						<WithdrawalLimitationTable
							loading={loading}
							editingKey={editingKey}
							editPermission={editPermission}
							setEditingKey={setEditingKey}
							onTableRowSave={onTableRowSave}
							withdrawalTableData={withdrawalTableData}
							form={form}
						/>
					</TabPane>
				)
			})}
		</Tabs>
	)
}

export { WithdrawalLimitationTab }
