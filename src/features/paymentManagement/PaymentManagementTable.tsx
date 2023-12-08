import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import {
	EditModalTypeEnum,
	IGetPaySettingData,
	PaymentStatusEnum,
} from 'features/paymentManagement/type'
import { Space, Switch, TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { DepositTypeEnum, PermissionInterface } from 'type'
import { Currency } from 'common/enum/type'
import { find } from 'lodash'
import { numberFormatter } from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'
import { PaginationInterface } from 'common/hooks'

interface IPaymentManagementTableProps {
	loading: boolean
	paySettingList: IGetPaySettingData[]
	globalStatusList: IEnumTypeData[]
	editPermission?: PermissionInterface
	setFeePermission?: PermissionInterface
	typeList: IEnumTypeData[]
	currencyListBySite: Currency[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onSetStatus: ({
		channelId,
		currencyId,
		status,
	}: {
		channelId: number
		currencyId: number
		status: boolean
	}) => void
	tableMethodList: IEnumTypeData[]
	amountRuleList: IEnumTypeData[]
	onBankModalClicked: ({
		payId,
		currencyId,
		channelId,
	}: {
		payId: number
		currencyId: number
		channelId: number
	}) => void
	onEditClick: (record: IGetPaySettingData, type: EditModalTypeEnum) => void
}
const PaymentManagementTable = ({
	loading,
	paySettingList,
	editPermission,
	setFeePermission,
	currencyListBySite,
	globalStatusList,
	pagination,
	typeList,
	onTableChange,
	onSetStatus,
	tableMethodList,
	onBankModalClicked,
	amountRuleList,
	onEditClick,
}: IPaymentManagementTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetPaySettingData) => (
				<Space>
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() => {
							onEditClick(record, EditModalTypeEnum.Edit)
						}}
					>
						{t('Label_Edit')}
					</Typography.Link>
					<Typography.Link
						disabled={!setFeePermission?.canUse}
						onClick={() => {
							onEditClick(record, EditModalTypeEnum.FeeSetting)
						}}
					>
						{t('Label_FeeSetting')}
					</Typography.Link>
				</Space>
			),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetPaySettingData) => {
				const { status: originStatus, channelId, currencyId } = record
				const status = originStatus === PaymentStatusEnum.True
				return (
					<Switch
						checked={status}
						disabled={!editPermission?.canUse}
						onClick={value => {
							onSetStatus({ channelId, currencyId, status: value })
						}}
					/>
				)
			},
		},
		{
			title: t('Label_Method'),
			key: 'method',
			dataIndex: 'method',
			width: 100,
			align: 'center' as 'center',
			render: (method: number) =>
				find(tableMethodList, target => target.value === method)?.name,
		},
		{
			title: t('Label_GateWay'),
			key: 'gateWay',
			dataIndex: 'payName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Group'),
			key: 'group',
			dataIndex: 'groupName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Channel'),
			key: 'channel',
			dataIndex: 'channelName',
			width: 130,
			align: 'center' as 'center',
			render: (channelName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{channelName}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Type'),
			key: 'type',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetPaySettingData) => {
				const { type, channelId, currencyId, payId } = record
				const displayName = find(
					typeList,
					target => target.value === type
				)?.name
				// 只有 onlineBank、quickTransfer 有額外 行為可使用 , 直接寫死在此處
				const isShowExtraAction = [
					DepositTypeEnum.OnlineBanking,
					DepositTypeEnum.QuickTransfer,
				].includes(type)
				return isShowExtraAction ? (
					<Typography.Link
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
						onClick={() => {
							onBankModalClicked({ payId, channelId, currencyId })
						}}
					>
						{displayName}
					</Typography.Link>
				) : (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{displayName}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currencyId',
			width: 80,
			align: 'center' as 'center',
			render: (currencyId: number) =>
				find(currencyListBySite, currency => currency.currencyId === currencyId)
					?.isoCode,
		},
		{
			title: t('Label_Min'),
			key: 'min',
			dataIndex: 'minAmount',
			width: 100,
			align: 'center' as 'center',
			render: (min: number) => numberFormatter.format(min),
		},
		{
			title: t('Label_Max'),
			key: 'max',
			dataIndex: 'maxAmount',
			width: 100,
			align: 'center' as 'center',
			render: (max: number) => numberFormatter.format(max),
		},
		{
			title: t('Label_AmountRule'),
			key: 'amountRule',
			dataIndex: 'amountRule',
			width: 100,
			align: 'center' as 'center',
			render: (amountRule: number) =>
				find(amountRuleList, target => target.value === amountRule)?.name,
		},
		{
			title: t('Label_GlobalStatus'),
			key: 'globalstatus',
			dataIndex: 'globalstatus',
			width: 100,
			align: 'center' as 'center',
			render: (globalstatus: number) => {
				const displayName = find(
					globalStatusList,
					status => status.value === globalstatus
				)?.name
				return displayName ?? '-'
			},
		},
		{
			title: t('Label_PointLevel'),
			key: 'pointLevel',
			dataIndex: 'pointLevel',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Sort'),
			key: 'sort',
			dataIndex: 'sort',
			width: 100,
			align: 'center' as 'center',
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				dataSource={paySettingList ?? []}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { PaymentManagementTable }
