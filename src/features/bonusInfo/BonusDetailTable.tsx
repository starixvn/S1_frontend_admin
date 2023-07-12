import { useTranslation } from 'react-i18next'
import {
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Progress,
	Row,
	Select,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { PermissionInterface } from 'type'
import { PaginationInterface } from 'common/hooks'
import { SorterResult } from 'antd/es/table/interface'
import { Table } from 'components'
import {
	IBonusDetailForm,
	IBonusDetailListData,
	IBonusInfoData,
} from 'features/bonusInfo/type'
import { find } from 'lodash'
import moment from 'moment'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'
import { ExcelExportButton } from 'features/bonusInfo/components/ExcelExportButton'
import { GroupByEnum } from 'features/bonusInfo/constants'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'

interface IBonusDetailTableProps {
	form: FormInstance<IBonusDetailForm>
	loading: boolean
	formGroupType: number
	currentBonusCodes: string[]
	currentDates: string[]
	bonusDetail: IBonusDetailListData[]
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	transactionTypeList: IEnumTypeData[]
	claimStatusList: IEnumTypeData[]
	exportExcelPermission?: PermissionInterface
	onBonusCodeChange: (value: string) => void
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IBonusInfoData>
	) => void
	onExportClick: () => void
	onRecordDateChange: (date: string) => void
}

const { Panel } = Collapse
const { Option } = Select
const { RangePicker } = DatePicker

const BonusDetailTable = ({
	form,
	loading,
	formGroupType,
	currentBonusCodes,
	currentDates,
	bonusDetail,
	transactionTypeList,
	claimStatusList,
	timeZoneUtcOffset,
	pagination,
	exportExcelPermission,
	onBonusCodeChange,
	onTableChange,
	onExportClick,
	onRecordDateChange,
}: IBonusDetailTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			width: 110,
			align: 'center' as 'center',
			sorter: true,
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 150,
			align: 'center' as 'center',
			render: (bonusCode: string) => bonusCode || '-',
		},
		{
			title: t('Label_ClaimDate'),
			key: 'claimDate',
			dataIndex: 'claimDate',
			width: 150,
			align: 'center' as 'center',
			sorter: true,
			render: (claimDate: string) =>
				claimDate ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(claimDate).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_BonusAmountClaimed'),
			key: 'bonusAmountClaim',
			dataIndex: 'bonusAmountClaim',
			width: 100,
			align: 'center' as 'center',
			sorter: true,
			render: (bonusAmountClaim: number) =>
				bonusAmountClaim ? numFormatToDigits(bonusAmountClaim) : 0,
		},
		{
			title: t('Label_TransactionType'),
			key: 'transactionType',
			dataIndex: 'transactionType',
			width: 100,
			align: 'center' as 'center',
			sorter: true,
			render: (transactionType: number) => {
				const typeName = find(
					transactionTypeList,
					({ value }) => value === transactionType
				)?.name

				return typeName ?? '-'
			},
		},
		{
			title: t('Label_TotalDeposit'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			width: 120,
			align: 'center' as 'center',
			sorter: true,
			render: (totalDeposit: number) =>
				totalDeposit ? numFormatToDigits(totalDeposit) : 0,
		},
		{
			title: t('Label_TotalWithdrawal'),
			key: 'totalWithdrawal',
			dataIndex: 'totalWithdrawal',
			width: 120,
			align: 'center' as 'center',
			sorter: true,
			render: (totalWithdrawal: number) =>
				totalWithdrawal ? numFormatToDigits(totalWithdrawal) : 0,
		},
		{
			title: t('Label_ClaimStatus'),
			key: 'claimStatus',
			dataIndex: 'claimStatus',
			width: 100,
			align: 'center' as 'center',
			sorter: true,
			render: (claimStatus: number) => {
				const statusName = find(
					claimStatusList,
					({ value }) => value === claimStatus
				)?.name
				return statusName ?? '-'
			},
		},
		{
			title: t('Label_Completion%'),
			key: 'completion',
			dataIndex: 'completion',
			width: 130,
			align: 'center' as 'center',
			sorter: true,
			render: (completion: number) => (
				<Progress
					percent={completion ? Number(completion.toFixed()) : 0}
					style={{ width: '90%' }}
				/>
			),
		},
	]
	return (
		<Collapse
			defaultActiveKey={1}
			style={{ marginTop: '30px', position: 'relative', marginBottom: '30px' }}
		>
			<Panel header={t('Label_Detail')} key='1'>
				{bonusDetail?.length > 0 && (
					<ExcelExportButton
						onClick={onExportClick}
						disabled={!exportExcelPermission?.canUse}
					/>
				)}
				<Form form={form}>
					<Row gutter={16}>
						{[GroupByEnum.Date, GroupByEnum.Month].includes(formGroupType) && (
							<Col span={6}>
								{formGroupType === GroupByEnum.Date ? (
									<Form.Item name='recordDate' label={t('Label_Date')}>
										<Select onChange={date => onRecordDateChange(date)}>
											{currentDates.map(value => (
												<Option value={value}>{value}</Option>
											))}
										</Select>
									</Form.Item>
								) : (
									<Form.Item label={t('Label_Date')}>
										<Input.Group
											compact
											style={{ width: '100%', display: 'flex' }}
										>
											<Form.Item
												noStyle
												name='dateRange'
												initialValue={MOMENT_DATE_RANGES.Today}
												rules={[
													{
														required: true,
														message: t('Label_DateRangeRequire'),
													},
												]}
											>
												<RangePicker
													style={{ width: '100%' }}
													ranges={MOMENT_RANGE_PICKER_RANGES([
														'Today',
														'Last 7 Day',
														'This Month',
													])}
													disabled
												/>
											</Form.Item>
										</Input.Group>
									</Form.Item>
								)}
							</Col>
						)}
						<Col span={6}>
							<Form.Item name='bonusCode' label={t('Label_BonusCode')}>
								<Select onChange={onBonusCodeChange}>
									{currentBonusCodes.map(value => (
										<Option value={value} key={value}>
											{value}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Table
					loading={loading}
					pagination={pagination as TablePaginationConfig}
					dataSource={bonusDetail}
					scroll={{ y: 400, x: 1000 }}
					columns={columns}
					// @ts-ignore
					onChange={onTableChange}
				/>
			</Panel>
		</Collapse>
	)
}

export { BonusDetailTable }
