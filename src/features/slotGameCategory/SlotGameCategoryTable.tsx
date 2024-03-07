import { FC } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import {
	Col,
	Form,
	FormInstance,
	Row,
	Select,
	Switch,
	TablePaginationConfig,
	Typography,
	Spin,
} from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'
import {
	ITableColumnsInfo,
	IGetSlotCategoryListResponse,
} from 'features/slotGameCategory/type'
import { PermissionInterface } from 'type'
import { PaginationInterface } from 'common/hooks'
import { useGetSlotCategoryListQuery } from 'features/slotGameCategory/api'
import { SlotCategoryEnum } from 'features/slotGameCategory/constants'

interface ISlotGameCategoryTableProps {
	loading: boolean
	isAllCategory: boolean
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
		isGoToPRD,
	}: {
		currencyId: number
		slotGameId: number
		status: boolean
		dataIndex: string
		isGoToPRD: boolean
	}) => void
	setAllStatus: ({
		slotGameId,
		activeInactiveAll,
	}: {
		slotGameId: number
		activeInactiveAll: boolean
	}) => void
	setGoToPRD: ({
		slotGameId,
		isGoToPRD,
	}: {
		slotGameId: number
		isGoToPRD: boolean
	}) => void
	categoryForm: FormInstance
}

const { Option } = Select

const SlotGameCategoryTable: FC<ISlotGameCategoryTableProps> = ({
	loading,
	isAllCategory,
	timeZoneUtcOffset,
	dataSource,
	columnInfos,
	editPermission,
	pagination,
	onTableChange,
	setStatus,
	setAllStatus,
	setGoToPRD,
	categoryForm,
}) => {
	const { t } = useTranslation()

	const {
		data: { data: slotCategoryList = [] } = {} as IGetSlotCategoryListResponse,
		isLoading: isGetSlotCategoryListLoading,
	} = useGetSlotCategoryListQuery(null)

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
					const { id: slotGameId, isGoToPRD } = record
					const { currencyId } = JSON.parse(dataIndex)
					const currentStatus = Boolean(record[dataIndex])
					return (
						<Switch
							checked={currentStatus}
							disabled={!editPermission?.canUse}
							onClick={() => {
								setStatus({
									currencyId,
									slotGameId,
									status: !currentStatus,
									dataIndex,
									isGoToPRD,
								})
							}}
						/>
					)
				},
			}
			// 依照
			target.splice(4 + index, 0, insertItem)
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
			title: t('Label_GoToPRD'),
			key: 'goToPrd',
			align: 'center' as 'center',
			render: (record: any) => {
				const { id: slotGameId, isGoToPRD } = record
				return (
					<Switch
						checked={isGoToPRD}
						disabled={!editPermission?.canUse}
						onChange={() => {
							setGoToPRD({
								slotGameId,
								isGoToPRD: !isGoToPRD,
							})
						}}
					/>
				)
			},
		},
		{
			title: t('Label_ActiveInactiveAll'),
			key: 'activeInactiveAll',
			align: 'center' as 'center',
			render: (record: any) => {
				const { id: slotGameId, activeInactiveAll } = record
				return (
					<Switch
						checked={activeInactiveAll}
						disabled={!editPermission?.canUse}
						onChange={() => {
							setAllStatus({
								slotGameId,
								activeInactiveAll: !activeInactiveAll,
							})
						}}
					/>
				)
			},
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
	].filter(column => {
		// 只有 allCategory 狀態要顯示 PRD 欄位，選 category狀態則不用
		if (isAllCategory) return true
		return column.key !== 'goToPrd'
	})

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
				<Spin spinning={isGetSlotCategoryListLoading}>
					<Row align='middle'>
						<Col span={8}>
							<Form.Item name='categoryId' label={t('Label_SetCategory')}>
								<Select>
									{slotCategoryList?.map(category => (
										<Option value={category.id} key={category.id}>
											{category.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Spin>
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
