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
import {
	FinancialTypeEnum,
	financialTypeOptions,
} from 'features/memberProfile/constants'
import { useTranslation } from 'react-i18next'
import { find } from 'lodash'

import { NEW_SITE_PREFIX_URL } from 'app/config'
import { Link } from 'react-router-dom'
import paths from 'app/constants/paths'
import { IFinancialLogData } from 'features/memberProfile/type'

const { Option } = Select

interface IFinancialLogsTableProps {
	custId: number
	form: FormInstance<{
		financialType: number
	}>
	loading: boolean
	dataSource: IFinancialLogData[]
	pagination: TablePaginationConfig
	onFinancialLogsSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const FinancialLogsTable = ({
	custId,
	form,
	loading,
	dataSource,
	pagination,
	onFinancialLogsSearch,
}: IFinancialLogsTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Time'),
			dataIndex: 'createTime',
			key: 'createTime',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Type'),
			dataIndex: 'financialType',
			key: 'financialType',
			align: 'center' as 'center',
			render: (financialType: number) =>
				find(financialTypeOptions, { value: financialType })?.value ?? 'N/A',
		},
		{
			title: t('Label_ChangeAmount'),
			dataIndex: 'changeAmount',
			key: 'changeAmount',
			align: 'center' as 'center',
		},
		{
			title: t('Label_AfterAmount'),
			dataIndex: 'afterAmount',
			key: 'afterAmount',
			align: 'center' as 'center',
		},
	]

	return (
		<>
			<Row align='middle' justify='space-between' style={{ height: '36px' }}>
				<Col>
					<Typography.Title style={{ margin: 0 }} level={5}>{`${t(
						'Label_Financial'
					)}:`}</Typography.Title>
				</Col>

				<Col>
					<Form
						form={form}
						initialValues={{ financialType: FinancialTypeEnum.Deposit }}
					>
						<Space>
							<Form.Item name='financialType' noStyle>
								<Select style={{ width: 180 }}>
									{financialTypeOptions.map(option => (
										<Option value={option.value}>{option.name}</Option>
									))}
								</Select>
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
				bordered
				loading={loading}
				dataSource={dataSource}
				columns={columns}
				pagination={{ ...pagination, hideOnSinglePage: true }}
			/>
		</>
	)
}

export default FinancialLogsTable
