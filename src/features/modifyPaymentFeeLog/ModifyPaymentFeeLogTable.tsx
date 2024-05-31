import { TablePaginationConfig, Typography } from 'antd'
import dayjs from 'dayjs'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { IModifyPaymentChargeFeeData } from 'features/modifyPaymentFeeLog/type'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { Currency } from 'common/enum/type'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'

interface IModifyPaymentFeeLogTableProps {
	loading: boolean
	modifyPaymentChargeFeeList: IModifyPaymentChargeFeeData[]
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	currencyListBySite: Currency[]
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const ModifyPaymentFeeLogTable = ({
	loading,
	modifyPaymentChargeFeeList,
	pagination,
	timeZoneUtcOffset,
	currencyListBySite,
	onTableChange,
}: IModifyPaymentFeeLogTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Gateway'),
			key: 'payName',
			dataIndex: 'payName',
			width: 100,
			align: 'center' as 'center',
			render: (payName: string) => payName || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyId',
			dataIndex: 'currencyId',
			width: 100,
			align: 'center' as 'center',
			render: (currencyId: number) =>
				find(currencyListBySite, { currencyId })?.isoCode ?? 'N/A',
		},
		{
			title: t('Label_Channel'),
			key: 'channelName',
			dataIndex: 'channelName',
			width: 100,
			align: 'center' as 'center',
			render: (channelName: string) => channelName || '-',
		},
		{
			title: t('Label_ChargeFee'),
			key: 'chargeFeePercentage',
			dataIndex: 'chargeFeePercentage',
			width: 100,
			align: 'center' as 'center',
			render: (chargeFeePercentage: number) =>
				numFormatToDigits(chargeFeePercentage) ?? '-',
		},
		{
			title: t('Label_PerCount'),
			key: 'chargeFeePreCount',
			dataIndex: 'chargeFeePreCount',
			width: 100,
			align: 'center' as 'center',
			render: (chargeFeePreCount: number) =>
				numFormatToDigits(chargeFeePreCount) ?? '-',
		},
		{
			title: t('Label_StartTime'),
			key: 'startTime',
			dataIndex: 'startTime',
			width: 100,
			align: 'center' as 'center',
			render: (startTime: string) =>
				startTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(startTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_EndTime'),
			key: 'endTime',
			dataIndex: 'endTime',
			width: 100,
			align: 'center' as 'center',
			render: (endTime: string) =>
				endTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(endTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 100,
			align: 'center' as 'center',
			render: (operator: string) => operator || '-',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={modifyPaymentChargeFeeList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default ModifyPaymentFeeLogTable
