import { find, isNumber } from 'lodash'
import { useTranslation } from 'react-i18next'
import React, { Dispatch, SetStateAction } from 'react'
import { numberFormatter } from 'common/utils/format'
import { EditableCellRows } from 'components'
import { Typography, Space, FormInstance, Form, Table } from 'antd'
import { PermissionInterface } from 'type'
import type { IUpgradeSettingTableData } from 'features/vipUpgradeSetting/type'
import { SiteIds } from 'app/constants/siteIds'
import { useGetVipLevelNameQuery } from './api'

interface IVipUpgradeSettingTableProps {
	loading: boolean
	form: FormInstance
	siteId: number
	editPermission?: PermissionInterface
	editingKey: number | undefined
	tableData: IUpgradeSettingTableData[]
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onRowSaved: () => void
}

const { Summary } = Table

const VipUpgradeSettingTable = ({
	loading,
	form,
	siteId,
	editPermission,
	editingKey,
	tableData,
	setEditingKey,
	onRowSaved,
}: IVipUpgradeSettingTableProps) => {
	const { t } = useTranslation()

	const {
		data: { data: vipLevelNameList = [] } = {},
		isLoading: isGetVipLevelNameLoading,
	} = useGetVipLevelNameQuery({ siteId })

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
				title: find(vipLevelNameList, { level: 1 })?.levelName,
				key: 'vintageClub',
				dataIndex: 'vintageClub',
				align: 'center' as 'center',
				width: 140,
				render: (vintageClub: number | null) =>
					vintageClub !== null ? numberFormatter.format(vintageClub) : '-',
			},
			{
				title: find(vipLevelNameList, { level: 2 })?.levelName,
				key: 'silverClub',
				dataIndex: 'silverClub',
				align: 'center' as 'center',
				width: 140,
				editable: siteId !== SiteIds.OneTwoBet,
				render: (silverClub: number | null) =>
					silverClub !== null ? numberFormatter.format(silverClub) : '-',
			},
			{
				title: find(vipLevelNameList, { level: 3 })?.levelName,
				key: 'goldClub',
				dataIndex: 'goldClub',
				align: 'center' as 'center',
				width: 140,
				editable: siteId !== SiteIds.OneTwoBet,
				render: (goldClub: number | null) =>
					goldClub !== null ? numberFormatter.format(goldClub) : '-',
			},
			{
				title: find(vipLevelNameList, { level: 4 })?.levelName,
				key: 'titaniumClub',
				dataIndex: 'titaniumClub',
				align: 'center' as 'center',
				width: 140,
				editable: true,
				render: (titaniumClub: number | null) =>
					titaniumClub !== null ? numberFormatter.format(titaniumClub) : '-',
			},
			{
				title: find(vipLevelNameList, { level: 5 })?.levelName,
				key: 'diamondClub',
				dataIndex: 'diamondClub',
				align: 'center' as 'center',
				width: 140,
				editable: true,
				render: (diamondClub: number) =>
					diamondClub !== null ? numberFormatter.format(diamondClub) : '-',
			},
			{
				title: find(vipLevelNameList, { level: 6 })?.levelName,
				key: 'novaClub',
				dataIndex: 'novaClub',
				align: 'center' as 'center',
				width: 140,
				editable: siteId === SiteIds.OneTwoBet,
				render: (novaClub: string | number) => {
					if (isNumber(novaClub)) return numberFormatter.format(novaClub)
					return novaClub || '-'
				},
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
				loading={loading || isGetVipLevelNameLoading}
				components={{
					body: {
						cell: EditableCellRows,
					},
				}}
				columns={mergeColumns}
				dataSource={tableData}
				pagination={false}
				// 最後一筆後端沒有提供且無法修改資料 暫用 summary 寫死
				summary={
					// eslint-disable-next-line react/no-unstable-nested-components
					() => {
						return siteId === SiteIds.OneTwoBet ? (
							<Summary.Row>
								<Summary.Cell index={1} align='center'>
									{' '}
								</Summary.Cell>
								<Summary.Cell index={2} align='center'>
									{' '}
								</Summary.Cell>
								<Summary.Cell index={3} align='center'>
									{t('Label_Normal')}
								</Summary.Cell>
								<Summary.Cell index={4} align='center'>
									{t('Label_Monthly')}
								</Summary.Cell>
								<Summary.Cell index={5} align='center'>
									{t('Label_ThreeTimesMonth')}
								</Summary.Cell>
								<Summary.Cell index={6} align='center'>
									{t('Label_Monthly')}
								</Summary.Cell>
								<Summary.Cell index={7} align='center'>
									{t('Label_Monthly')}
								</Summary.Cell>
								<Summary.Cell index={8} align='center'>
									{t('Label_Monthly')}
								</Summary.Cell>
							</Summary.Row>
						) : (
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
