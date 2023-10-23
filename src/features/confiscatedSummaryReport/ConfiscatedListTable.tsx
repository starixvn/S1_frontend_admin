import moment from 'moment'
import { Table } from 'components'
import { Table as AntdTable, TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { timeFormat, numFormatToDigits } from 'common/utils/format'
import { IConfiscatedData } from 'features/confiscatedSummaryReport/type'
import { isPositiveNum, sumTotalObject } from 'common/utils'

interface IConfiscatedSummaryReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	confiscatedList: IConfiscatedData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const { Summary } = AntdTable
const { Text } = Typography

const ConfiscatedListTable = ({
	loading,
	pagination,
	timeZoneUtcOffset,
	confiscatedList,
	onTableChange,
}: IConfiscatedSummaryReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_SuspendDate'),
			key: 'suspendDate',
			dataIndex: 'suspendDate',
			align: 'center' as 'center',
			render: (suspendDate: string) =>
				suspendDate
					? moment(suspendDate).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaId',
			dataIndex: 'sabaId',
			align: 'center' as 'center',
			render: (sabaId: string) => sabaId || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			align: 'center' as 'center',
			render: (currency: string) => currency || '-',
		},
		{
			title: t('Label_RegistrationDate'),
			key: 'registrationDate',
			dataIndex: 'registrationDate',
			align: 'center' as 'center',
			render: (registrationDate: string) =>
				registrationDate
					? moment(registrationDate)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
		{
			title: t('Label_VipLevel'),
			key: 'levelName',
			dataIndex: 'levelName',
			align: 'center' as 'center',
			render: (levelName: string) => levelName || '-',
		},
		{
			title: t('Label_SeamlessWallet'),
			key: 'seamlessWallet',
			dataIndex: 'seamlessWallet',
			align: 'center' as 'center',
			render: (seamlessWallet: number) => (
				<Text
					type={isPositiveNum(seamlessWallet) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(seamlessWallet || 0)}
				</Text>
			),
		},
		{
			title: t('Label_TotalDeposit'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			align: 'center' as 'center',
			render: (totalDeposit: number) => (
				<Text
					type={isPositiveNum(totalDeposit) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(totalDeposit || 0)}
				</Text>
			),
		},
		{
			title: t('Label_TotalWithdrawal'),
			key: 'totalWithdrawal',
			dataIndex: 'totalWithdrawal',
			align: 'center' as 'center',
			render: (totalWithdrawal: number) => (
				<Text
					type={isPositiveNum(totalWithdrawal) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(totalWithdrawal || 0)}
				</Text>
			),
		},
		{
			title: t('Label_NetDeposit'),
			key: 'netDeposit',
			dataIndex: 'netDeposit',
			align: 'center' as 'center',
			render: (netDeposit: number) => (
				<Text
					type={isPositiveNum(netDeposit) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(netDeposit || 0)}
				</Text>
			),
		},
		{
			title: t('Label_NetConfiscatedCash'),
			key: 'netConfiscatedCash',
			dataIndex: 'netConfiscatedCash',
			align: 'center' as 'center',
			render: (netConfiscatedCash: number) => (
				<Text
					type={isPositiveNum(netConfiscatedCash) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(netConfiscatedCash || 0)}
				</Text>
			),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={confiscatedList}
				pagination={pagination as TablePaginationConfig}
				summary={
					// eslint-disable-next-line react/no-unstable-nested-components
					pageData => {
						if (pageData.length <= 1) return null
						const totalData: IConfiscatedData = sumTotalObject(
							pageData as object[]
						)
						const {
							seamlessWallet,
							totalDeposit,
							totalWithdrawal,
							netDeposit,
							netConfiscatedCash,
						} = totalData

						return (
							<Summary.Row>
								<Summary.Cell index={0} align='center'>
									{t('Label_Total')}
								</Summary.Cell>
								<Summary.Cell index={1} />
								<Summary.Cell index={2} />
								<Summary.Cell index={3} />
								<Summary.Cell index={4} />
								<Summary.Cell index={5} />
								<Summary.Cell index={6} align='center'>
									{seamlessWallet ? numFormatToDigits(seamlessWallet) : 0}
								</Summary.Cell>
								<Summary.Cell index={7} align='center'>
									{totalDeposit ? numFormatToDigits(totalDeposit) : 0}
								</Summary.Cell>
								<Summary.Cell index={8} align='center'>
									<Text
										type={isPositiveNum(totalWithdrawal) ? undefined : 'danger'}
										style={{ whiteSpace: 'nowrap', padding: '5px' }}
									>
										{totalWithdrawal ? numFormatToDigits(totalWithdrawal) : 0}
									</Text>
								</Summary.Cell>
								<Summary.Cell index={9} align='center'>
									<Text
										type={isPositiveNum(netDeposit) ? undefined : 'danger'}
										style={{ whiteSpace: 'nowrap', padding: '5px' }}
									>
										{netDeposit ? numFormatToDigits(netDeposit) : 0}
									</Text>
								</Summary.Cell>
								<Summary.Cell index={10} align='center'>
									<Text
										type={
											isPositiveNum(netConfiscatedCash) ? undefined : 'danger'
										}
										style={{ whiteSpace: 'nowrap', padding: '5px' }}
									>
										{netConfiscatedCash
											? numFormatToDigits(netConfiscatedCash)
											: 0}
									</Text>
								</Summary.Cell>
							</Summary.Row>
						)
					}
				}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default ConfiscatedListTable
