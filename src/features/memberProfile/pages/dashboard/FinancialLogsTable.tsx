import React from 'react'
import {
	Button,
	Col,
	Form,
	FormInstance,
	Row,
	Select,
	Space,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { find } from 'lodash'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { Link } from 'react-router-dom'
import paths from 'app/constants/paths'
import { IFinancialLogData } from 'features/memberProfile/type'
import dayjs from 'dayjs'
import {
	numberFormatter,
	numFormatToDigits,
	timeFormat,
} from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'
import { MultipleSelect } from 'components/Select'

const { Option } = Select

interface IFinancialLogsTableProps {
	custId: number
	form: FormInstance<{
		financialType: number[]
	}>
	loading: boolean
	dataSource: IFinancialLogData[]
	pagination: TablePaginationConfig
	typeList: IEnumTypeData[]
	onFinancialLogsSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const FinancialLogsTable = ({
	custId,
	form,
	loading,
	dataSource,
	pagination,
	typeList,
	onFinancialLogsSearch,
	timeZoneUtcOffset,
	onTableChange,
}: IFinancialLogsTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Time'),
			dataIndex: 'createTime',
			key: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Type'),
			dataIndex: 'financialType',
			key: 'financialType',
			align: 'center' as 'center',
			render: (financialType: number) =>
				find(typeList, { value: financialType })?.name ?? 'N/A',
		},
		{
			title: t('Label_ChangeAmount'),
			key: 'changeAmount',
			align: 'center' as 'center',
			render: (records: { changeAmount: number; direction: number }) => {
				const { changeAmount, direction } = records
				// 後端回傳direction參數:1代表'+' 2代表'-'
				const sign = direction === 1 ? '+' : '-'
				return `${sign}${numFormatToDigits(changeAmount)}`
			},
		},
		{
			title: t('Label_AfterAmount'),
			dataIndex: 'afterAmount',
			key: 'afterAmount',
			align: 'center' as 'center',
			render: (afterAmount: number) => numberFormatter.format(afterAmount),
		},
	]

	const typeSelector = () => {
		const onChangeType = (newType: ('all' | number)[]) => {
			if (newType.includes('all')) {
				form.setFieldsValue({
					financialType: typeList?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					financialType: newType as number[],
				})
			}
		}
		return (
			<MultipleSelect onChange={onChangeType} style={{ width: 180 }}>
				{(typeList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{typeList.map(({ name, value }) => (
					<Option key={name} value={value}>
						{name}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	return (
		<>
			<Row align='middle' justify='space-between' style={{ height: '36px' }}>
				<Col>
					<Typography.Title style={{ margin: 0 }} level={5}>{`${t(
						'Label_Financial'
					)}:`}</Typography.Title>
				</Col>

				<Col>
					<Form form={form}>
						<Space>
							<Form.Item name='financialType' noStyle>
								{typeSelector()}
							</Form.Item>

							<Button
								onClick={() => onFinancialLogsSearch({})}
								style={{ width: '100%' }}
								type='primary'
								htmlType='submit'
							>
								{t('Label_Search')}
							</Button>
							<Link
								to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/financialLog/${custId}`}
							>
								{t('Label_More')}
							</Link>
						</Space>
					</Form>
				</Col>
			</Row>
			<br />

			<Table
				size='small'
				bordered
				loading={loading}
				dataSource={dataSource}
				columns={columns}
				pagination={{ ...pagination, hideOnSinglePage: true }}
				onChange={onTableChange}
			/>
		</>
	)
}

export default FinancialLogsTable
