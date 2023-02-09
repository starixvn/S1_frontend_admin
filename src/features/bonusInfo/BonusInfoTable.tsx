import { find } from 'lodash'
import moment from 'moment/moment'
import { PaginationInterface } from 'common/hooks'
import { IBonusInfoData } from 'features/bonusInfo/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import {
	TablePaginationConfig,
	Typography,
	Table as AntdTable,
	Collapse,
} from 'antd'
import { IEnumTypeData } from 'common/service/enumApi'
import { dateFormat, numFormatToDigits } from 'common/utils/format'
import { SorterResult } from 'antd/es/table/interface'
import { IGetBetListData } from 'features/betList/type'
import { ExcelExportButton } from 'features/bonusInfo/components/ExcelExportButton'
import { PermissionInterface } from 'type'
import { sumTotalObject } from 'common/utils'

interface IBonusInfoTableProps {
	loading: boolean
	bonusInfo: IBonusInfoData[]
	bonusTypeList: IEnumTypeData[]
	bonusStatusList: IEnumTypeData[]
	exportExcelPermission?: PermissionInterface
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IGetBetListData>
	) => void
	onExportClick: () => void
	onClickBonusCode: (bonusCode: string) => void
}

const { Summary } = AntdTable
const { Panel } = Collapse

const BonusInfoTable = ({
	loading,
	bonusInfo,
	bonusTypeList,
	bonusStatusList,
	exportExcelPermission,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	onExportClick,
	onClickBonusCode,
}: IBonusInfoTableProps) => {
	const { t } = useTranslation()
	// 這張 Table 希望盡可能全部看到  不要有 scroll，所以寬度抓得很緊
	const columns = [
		{
			title: t('Label_BonusName'),
			key: 'bonusName',
			dataIndex: 'bonusName',
			width: 100,
			align: 'center' as 'center',
			sorter: true,
			render: (bonusName: string) => bonusName || '-',
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 100,
			align: 'center' as 'center',
			sorter: true,
			render: (bonusCode: string) =>
				bonusCode ? (
					<Typography.Link onClick={() => onClickBonusCode(bonusCode)}>
						{bonusCode}
					</Typography.Link>
				) : (
					''
				),
		},
		{
			title: t('Label_BonusType'),
			key: 'bonusType',
			dataIndex: 'bonusType',
			width: 80,
			align: 'center' as 'center',
			sorter: true,
			render: (bonusType: number) => {
				const typeName = find(
					bonusTypeList,
					({ value }) => value === bonusType
				)?.name
				return typeName ?? ''
			},
		},
		{
			title: t('Label_StartDate'),
			key: 'startTime',
			dataIndex: 'startTime',
			width: 80,
			align: 'center' as 'center',
			sorter: true,
			render: (startTime: string) =>
				startTime
					? moment(startTime).utcOffset(timeZoneUtcOffset).format(dateFormat)
					: '',
		},
		{
			title: t('Label_EndDate'),
			key: 'endTime',
			dataIndex: 'endTime',
			width: 80,
			align: 'center' as 'center',
			sorter: true,
			render: (endTime: string) =>
				endTime
					? moment(endTime).utcOffset(timeZoneUtcOffset).format(dateFormat)
					: '',
		},
		{
			title: t('Label_BonusStatus'),
			key: 'bonusStatus',
			dataIndex: 'bonusStatus',
			width: 80,
			align: 'center' as 'center',
			sorter: true,
			render: (bonusStatus: number) => {
				const statusName = find(
					bonusStatusList,
					({ value }) => value === bonusStatus
				)?.name
				return statusName ?? '-'
			},
		},
		{
			title: t('Label_ClaimStatus'),
			key: 'claimStatus',
			dataIndex: 'claimStatus',
			width: 320,
			align: 'center' as 'center',
			children: [
				{
					title: t('Label_Running'),
					key: 'runningCount',
					dataIndex: 'runningCount',
					width: 80,
					align: 'center' as 'center',
					sorter: true,
					render: (runningCount: number) =>
						runningCount ? numFormatToDigits(runningCount) : 0,
				},
				{
					title: t('BonusReportStatuses.Label_Canceled'),
					key: 'cancelCount',
					dataIndex: 'cancelCount',
					width: 80,
					align: 'center' as 'center',
					sorter: true,
					render: (cancelCount: number) =>
						cancelCount ? numFormatToDigits(cancelCount) : 0,
				},
				{
					title: t('Label_FullFill'),
					key: 'fulFillCount',
					dataIndex: 'fulFillCount',
					width: 80,
					align: 'center' as 'center',
					sorter: true,
					render: (fulFillCount: number) =>
						fulFillCount ? numFormatToDigits(fulFillCount) : 0,
				},
				{
					title: t('Label_OtherPlatform'),
					key: 'otherPlatformCount',
					dataIndex: 'otherPlatformCount',
					width: 80,
					align: 'center' as 'center',
					sorter: true,
					render: (otherPlatformCount: number) =>
						otherPlatformCount ? numFormatToDigits(otherPlatformCount) : 0,
				},
			],
		},
		{
			title: t('Label_TotalClaimants'),
			key: 'totalClaimants',
			dataIndex: 'totalClaimants',
			width: 85,
			align: 'center' as 'center',
			sorter: true,
			render: (totalClaimants: number) =>
				totalClaimants ? numFormatToDigits(totalClaimants) : 0,
		},
		{
			title: t('Label_TotalClaimedAmount'),
			key: 'totalClaimedAmount',
			dataIndex: 'totalClaimedAmount',
			width: 80,
			align: 'center' as 'center',
			sorter: true,
			render: (totalClaimedAmount: number) =>
				totalClaimedAmount ? numFormatToDigits(totalClaimedAmount) : 0,
		},
		{
			title: t('Label_GGR'),
			key: 'ggr',
			dataIndex: 'ggr',
			width: 80,
			align: 'center' as 'center',
			sorter: true,
			render: (ggr: number) => (ggr ? numFormatToDigits(ggr) : 0),
		},
		{
			title: t('Label_TotalDeposit'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			width: 80,
			align: 'center' as 'center',
			sorter: true,
			render: (totalDeposit: number) =>
				totalDeposit ? numFormatToDigits(totalDeposit) : 0,
		},
		{
			title: t('Label_TotalWithdrawal'),
			key: 'totalWithdrawal',
			dataIndex: 'totalWithdrawal',
			width: 100,
			align: 'center' as 'center',
			sorter: true,
			render: (totalWithdrawal: number) =>
				totalWithdrawal ? numFormatToDigits(totalWithdrawal) : 0,
		},
	]
	return (
		<Collapse
			defaultActiveKey={1}
			style={{ margin: '30px 0', position: 'relative' }}
		>
			<Panel header={t('Label_Summary')} key='1'>
				{bonusInfo?.length > 0 && (
					<ExcelExportButton
						onClick={onExportClick}
						disabled={!exportExcelPermission?.canUse}
					/>
				)}
				<Table
					loading={loading}
					pagination={pagination as TablePaginationConfig}
					dataSource={bonusInfo}
					// eslint-disable-next-line react/no-unstable-nested-components
					summary={pageData => {
						if (pageData.length <= 1) return null
						const totalData: IBonusInfoData = sumTotalObject(
							pageData as object[]
						)
						const {
							runningCount,
							cancelCount,
							fulFillCount,
							otherPlatformCount,
							totalClaimants,
							totalClaimedAmount,
							ggr,
							totalDeposit,
							totalWithdrawal,
						} = totalData
						return (
							<Summary fixed>
								<Summary.Row style={{ background: '#fafafa' }}>
									<Summary.Cell index={1} align='center'>
										{t('Label_Total')}
									</Summary.Cell>
									<Summary.Cell index={2} colSpan={5} align='center'>
										-
									</Summary.Cell>
									<Summary.Cell index={7} align='center'>
										{runningCount ? numFormatToDigits(runningCount) : 0}
									</Summary.Cell>
									<Summary.Cell index={8} align='center'>
										{cancelCount ? numFormatToDigits(cancelCount) : 0}
									</Summary.Cell>
									<Summary.Cell index={9} align='center'>
										{fulFillCount ? numFormatToDigits(fulFillCount) : 0}
									</Summary.Cell>
									<Summary.Cell index={10} align='center'>
										{otherPlatformCount
											? numFormatToDigits(otherPlatformCount)
											: 0}
									</Summary.Cell>
									<Summary.Cell index={11} align='center'>
										{totalClaimants ? numFormatToDigits(totalClaimants) : 0}
									</Summary.Cell>
									<Summary.Cell index={12} align='center'>
										{totalClaimedAmount
											? numFormatToDigits(totalClaimedAmount)
											: 0}
									</Summary.Cell>
									<Summary.Cell index={13} align='center'>
										{ggr ? numFormatToDigits(ggr) : 0}
									</Summary.Cell>
									{/* 怪怪的 bug 這裡 index 不能給 14 他會自動加入 colSpan={2} , 給 14以外就沒事  */}
									<Summary.Cell index={15} align='center'>
										{totalDeposit ? numFormatToDigits(totalDeposit) : 0}
									</Summary.Cell>
									<Summary.Cell index={16} align='center'>
										{totalWithdrawal ? numFormatToDigits(totalWithdrawal) : 0}
									</Summary.Cell>
								</Summary.Row>
							</Summary>
						)
					}}
					// @ts-ignore
					onChange={onTableChange}
					columns={columns}
					scroll={{ y: 400, x: undefined }}
				/>
			</Panel>
		</Collapse>
	)
}

export { BonusInfoTable }
