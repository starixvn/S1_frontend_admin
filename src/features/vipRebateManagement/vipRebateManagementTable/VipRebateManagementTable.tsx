import { find } from 'lodash'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Space, Table, Tabs, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { PermissionInterface } from 'type'
import { numberFormatter, percentageFormatter } from 'common/utils/format'
import { BsFillPencilFill } from 'react-icons/bs'
import { IRebateTableData } from '../type'
import { EditableTableCell } from './EditableTableCell'
import { useGetVipLevelNameQuery } from '../../vipUpgradeSetting/api'

interface VipRebateTableInterface {
	loading: boolean
	onTabsChange: (TabsKey: string) => void
	currencyList: Currency[] | undefined
	editPermission?: PermissionInterface
	rebateTableData: IRebateTableData[]
	form: FormInstance
	editingKey: number | undefined
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
	onSaved: () => void
	tabActiveKey?: string
	onSetByProduct: (categoryId: number) => void
	siteId: number
}

const VipRebateManagementTable: FC<VipRebateTableInterface> = ({
	loading,
	onTabsChange,
	currencyList,
	editPermission,
	rebateTableData,
	form,
	editingKey,
	setEditingKey,
	onSaved,
	tabActiveKey,
	onSetByProduct,
	siteId,
}) => {
	const { t } = useTranslation()
	const { TabPane } = Tabs

	const {
		data: { data: vipLevelNameList = [] } = {},
		isLoading: isGetVipLevelNameLoading,
	} = useGetVipLevelNameQuery({ siteId })

	const onEdit = (record: IRebateTableData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.categoryId)
	}
	const isEditing = (record: IRebateTableData) =>
		record.categoryId === editingKey

	const columns = () => {
		return [
			{
				title: t('Label_Action'),
				key: 'operation',
				width: 80,
				align: 'center' as 'center',
				render: (record: IRebateTableData) => {
					const editable = isEditing(record)

					return editable ? (
						<Space>
							<Typography.Link onClick={onSaved} style={{ marginRight: 8 }}>
								{t('Label_Save')}
							</Typography.Link>
							<Typography.Link onClick={() => setEditingKey(undefined)}>
								{t('Label_Cancel')}
							</Typography.Link>
						</Space>
					) : (
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() => onEdit(record)}
						>
							{t('Label_Edit')}
						</Typography.Link>
					)
				},
			},
			{
				title: t('Label_GameType'),
				key: 'categoryName',
				dataIndex: 'categoryName',
				width: 100,
				align: 'center' as 'center',
			},
			{
				title: find(vipLevelNameList, { level: 1 })?.levelName,
				key: 'vintageClub',
				dataIndex: 'vintageClub',
				width: 120,
				align: 'center' as 'center',
				editable: true,
				render: (vintageClub: number | null) => {
					return vintageClub !== null ? percentageFormatter(vintageClub) : 'N/A'
				},
			},
			{
				title: find(vipLevelNameList, { level: 2 })?.levelName,
				key: 'silverClub',
				dataIndex: 'silverClub',
				width: 120,
				align: 'center' as 'center',
				editable: true,
				render: (silverClub: number | null) => {
					return silverClub !== null ? percentageFormatter(silverClub) : 'N/A'
				},
			},
			{
				title: find(vipLevelNameList, { level: 3 })?.levelName,
				key: 'goldClub',
				dataIndex: 'goldClub',
				width: 120,
				align: 'center' as 'center',
				editable: true,
				render: (goldClub: number | null) => {
					return goldClub !== null ? percentageFormatter(goldClub) : 'N/A'
				},
			},
			{
				title: find(vipLevelNameList, { level: 4 })?.levelName,
				key: 'titaniumClub',
				dataIndex: 'titaniumClub',
				width: 120,
				align: 'center' as 'center',
				editable: true,
				render: (titaniumClub: number | null) => {
					return titaniumClub !== null
						? percentageFormatter(titaniumClub)
						: 'N/A'
				},
			},
			{
				title: find(vipLevelNameList, { level: 5 })?.levelName,
				key: 'diamondClub',
				dataIndex: 'diamondClub',
				width: 120,
				align: 'center' as 'center',
				editable: true,
				render: (diamondClub: number | null) => {
					return diamondClub !== null ? percentageFormatter(diamondClub) : 'N/A'
				},
			},
			{
				title: find(vipLevelNameList, { level: 6 })?.levelName,
				key: 'novaClub',
				dataIndex: 'novaClub',
				width: 120,
				align: 'center' as 'center',
				editable: true,
				render: (novaClub: number | null) => {
					return novaClub !== null ? percentageFormatter(novaClub) : 'N/A'
				},
			},
			{
				title: t('Label_MinPayout'),
				key: 'minPayout',
				dataIndex: 'minPayout',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (minPayout: number | null) =>
					minPayout !== null ? numberFormatter.format(minPayout) : 'N/A',
			},
			{
				title: t('Label_MaxPayout'),
				key: 'maxPayout',
				dataIndex: 'maxPayout',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (maxPayout: number | null) =>
					maxPayout !== null ? numberFormatter.format(maxPayout) : 'N/A',
			},
			{
				title: t('Label_SetByProduct'),
				key: 'setByProduct',
				width: 100,
				align: 'center' as 'center',
				render: (values: IRebateTableData) => (
					<Typography.Link
						disabled={!editPermission?.canUse}
						type='secondary'
						onClick={() => {
							onSetByProduct(values.categoryId)
						}}
					>
						<BsFillPencilFill />
					</Typography.Link>
				),
			},
		]
	}

	const mergedColumns = columns().map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IRebateTableData) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Tabs
					defaultActiveKey='1'
					onChange={onTabsChange}
					type='card'
					activeKey={tabActiveKey}
				>
					{currencyList?.map(item => (
						<TabPane tab={item.isoCode} key={item.currencyId}>
							<Table
								components={{
									body: {
										cell: EditableTableCell,
									},
								}}
								loading={loading || isGetVipLevelNameLoading}
								columns={mergedColumns}
								dataSource={rebateTableData ?? []}
							/>
						</TabPane>
					))}
				</Tabs>
			</Form>
		</LayoutContent.Card>
	)
}

export { VipRebateManagementTable }
