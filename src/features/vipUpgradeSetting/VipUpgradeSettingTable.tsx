import { useTranslation } from 'react-i18next'
import React, { Dispatch, SetStateAction } from 'react'
import { Typography, Space, FormInstance, Form, Table } from 'antd'
import { numberFormatter } from 'common/utils/format'
import { PermissionInterface } from 'type'
import { IUpgradeSettingTableData } from 'features/vipUpgradeSetting/type'
import { EditableCellRows } from 'components'

interface IVipUpgradeSettingTableProps {
	loading: boolean
	form: FormInstance
	editPermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	tableData: IUpgradeSettingTableData[]
	onRowSaved: () => void
}

const { Summary } = Table

const VipUpgradeSettingTable = ({
	loading,
	form,
	editPermission,
	editingKey,
	setEditingKey,
	tableData,
	onRowSaved,
}: IVipUpgradeSettingTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IUpgradeSettingTableData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.type)
	}

	const isEditing = (record: IUpgradeSettingTableData) =>
		record.type === editingKey

	const columns = () => {
		return [
			{
				title: t('Label_Action'),
				key: 'operation',
				width: 125,
				align: 'center' as 'center',
				render: (record: IUpgradeSettingTableData) => {
					const editable = isEditing(record)
					return editable ? (
						<Space size='middle'>
							<Typography.Link onClick={onRowSaved}>
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
				title: '',
				key: 'typeName',
				dataIndex: 'typeName',
				align: 'center' as 'center',
				width: 300,
				render: (typeName: string) => typeName || '-',
			},
			{
				title: t('Label_VintageClub'),
				key: 'vintageClub',
				dataIndex: 'vintageClub',
				align: 'center' as 'center',
				width: 140,
				render: (vintageClub: number | null) =>
					vintageClub !== null ? numberFormatter.format(vintageClub) : '-',
			},
			{
				title: t('Label_SliverClub'),
				key: 'silverClub',
				dataIndex: 'silverClub',
				align: 'center' as 'center',
				width: 140,
				editable: true,
				render: (silverClub: number | null) =>
					silverClub !== null ? numberFormatter.format(silverClub) : '-',
			},
			{
				title: t('Label_GoldClub'),
				key: 'goldClub',
				dataIndex: 'goldClub',
				align: 'center' as 'center',
				width: 140,
				editable: true,
				render: (goldClub: number | null) =>
					goldClub !== null ? numberFormatter.format(goldClub) : '-',
			},
			{
				title: t('Label_TitaniumClub'),
				key: 'titaniumClub',
				dataIndex: 'titaniumClub',
				align: 'center' as 'center',
				width: 140,
				editable: true,
				render: (titaniumClub: number | null) =>
					titaniumClub !== null ? numberFormatter.format(titaniumClub) : '-',
			},
			{
				title: t('Label_DiamondClub'),
				key: 'diamondClub',
				dataIndex: 'diamondClub',
				align: 'center' as 'center',
				width: 140,
				editable: true,
				render: (diamondClub: number) =>
					diamondClub !== null ? numberFormatter.format(diamondClub) : '-',
			},
			{
				title: t('Label_NovaClub'),
				key: 'novaClub',
				dataIndex: 'novaClub',
				align: 'center' as 'center',
				width: 140,
				render: (novaClub: string) => novaClub || '-',
			},
		]
	}

	const mergeColumns = columns().map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IUpgradeSettingTableData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'number',
			}),
		}
	})

	return (
		<Form form={form} component={false}>
			<Table
				loading={loading}
				components={{
					body: {
						cell: EditableCellRows,
					},
				}}
				columns={mergeColumns}
				dataSource={tableData}
				pagination={false}
				summary={
					// eslint-disable-next-line react/no-unstable-nested-components
					() => {
						return (
							<Summary.Row>
								<Summary.Cell index={1} align='center'>
									{' '}
								</Summary.Cell>
								<Summary.Cell index={2} align='center'>
									{t('Label_RankingValidityMembershipRenewal')}
								</Summary.Cell>
								<Summary.Cell index={3} align='center'>
									{t('Label_Normal')}
								</Summary.Cell>
								<Summary.Cell index={4} align='center'>
									{t('Label_Lifetime')}
								</Summary.Cell>
								<Summary.Cell index={5} align='center'>
									{t('Label_3Months')}
								</Summary.Cell>
								<Summary.Cell index={6} align='center'>
									{t('Label_3Months')}
								</Summary.Cell>
								<Summary.Cell index={7} align='center'>
									{t('Label_3Months')}
								</Summary.Cell>
								<Summary.Cell index={8} align='center'>
									{t('Label_3Months')}
								</Summary.Cell>
							</Summary.Row>
						)
					}
				}
			/>
		</Form>
	)
}

export default VipUpgradeSettingTable
