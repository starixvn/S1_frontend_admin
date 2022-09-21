import { FC } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import {
	Col,
	Form,
	FormInstance,
	Popconfirm,
	Row,
	Select,
	Switch,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'
import { ITableColumnsInfo } from 'features/slotGameCategory/type'
import { PermissionInterface } from 'type'
import { PaginationInterface } from 'common/hooks'
import {
	SlotCategoryEnum,
	slotGameCategoryList,
} from 'features/slotGameCategory/constants'

interface ISlotGameCategoryTableProps {
	loading: boolean
	timeZoneUtcOffset: number
	dataSource: any[]
	columnInfos: ITableColumnsInfo[]
	editPermission?: PermissionInterface
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	setStatus: ({
		currencyId,
		slotGameId,
		status,
		dataIndex,
	}: {
		currencyId: number
		slotGameId: number
		status: boolean
		dataIndex: string
	}) => void
	categoryForm: FormInstance
}

const { Option } = Select

const SlotGameCategoryTable: FC<ISlotGameCategoryTableProps> = ({
	loading,
	timeZoneUtcOffset,
	dataSource,
	columnInfos,
	editPermission,
	pagination,
	onTableChange,
	setStatus,
	categoryForm,
}) => {
	const { t } = useTranslation()
	const columnsRenderer = (
		target: any[],
		currencyColumns: ITableColumnsInfo[]
	) => {
		currencyColumns.forEach((currency, index) => {
			const { title, dataIndex } = currency
			const insertItem = {
				title,
				key: dataIndex,
				align: 'center' as 'center',
				render: (record: any) => {
					const { id: slotGameId } = record
					const { currencyId } = JSON.parse(dataIndex)
					const currentStatus = Boolean(record[dataIndex])
					return (
						<Popconfirm
							disabled={!editPermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() => {
								setStatus({
									currencyId,
									slotGameId,
									status: !currentStatus,
									dataIndex,
								})
							}}
						>
							<Switch
								checked={currentStatus}
								disabled={!editPermission?.canUse}
							/>
						</Popconfirm>
					)
				},
			}
			// 依照
			target.splice(3 + index, 0, insertItem)
		})
		return target
	}
	const defaultColumns = [
		{
			title: t('Label_GameId'),
			key: 'gameId',
			dataIndex: 'gameId',
			align: 'center' as 'center',
			render: (gameId: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{gameId ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Ename'),
			key: 'eName',
			dataIndex: 'eName',
			align: 'center' as 'center',
			render: (eName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{eName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Cname'),
			key: 'cName',
			dataIndex: 'cName',
			align: 'center' as 'center',
			render: (cName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{cName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastOperator'),
			dataIndex: `operator`,
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LastUpdateTime'),
			dataIndex: `updateTime`,
			width: 140,
			align: 'center' as 'center',
			editable: false,
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]

	const mergedColumn = columnsRenderer(defaultColumns, columnInfos)
	return (
		<LayoutContent.Card>
			<Form
				form={categoryForm}
				initialValues={{
					categoryId: SlotCategoryEnum.AllAndSetStatus,
				}}
				style={{ marginTop: '10px' }}
			>
				<Row align='middle'>
					<Col span={8}>
						<Form.Item name='categoryId' label={t('Label_SetCategory')}>
							<Select>
								{slotGameCategoryList?.map(category => (
									<Option value={category.value} key={category.value}>
										{t(category.displayName)}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<Table
				columns={mergedColumn}
				dataSource={dataSource}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
				loading={loading}
			/>
		</LayoutContent.Card>
	)
}

export { SlotGameCategoryTable }
