import React from 'react'
import {
	Form,
	FormInstance,
	Space,
	TablePaginationConfig,
	Typography,
} from 'antd'
import moment from 'moment'
import { PaginationInterface } from 'common/hooks'
import { IGetVideoData, ITableForm } from 'features/videoManagement/type'
import { PermissionInterface } from 'type'
import { Currency } from 'common/enum/type'
import { timeFormat } from 'common/utils/format'
import { timeZoneLocalOffset } from 'common/utils'
import { EditableCellRows, Table } from 'components'
import { useTranslation } from 'react-i18next'
import { find } from 'lodash'
import { LayoutContent } from 'app/pages/layout'

interface IVideoManagementTableProps {
	loading: boolean
	form: FormInstance<ITableForm>
	videoList: IGetVideoData[]
	pagination: PaginationInterface
	editPermission?: PermissionInterface
	currencyListBySite: Currency[]
	editingKey: IGetVideoData | undefined
	setEditingKey: React.Dispatch<React.SetStateAction<IGetVideoData | undefined>>
	onSaved: (record: IGetVideoData) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const VideoManagementTable = ({
	loading,
	form,
	videoList,
	pagination,
	editPermission,
	currencyListBySite,
	editingKey,
	setEditingKey,
	onSaved,
	onTableChange,
}: IVideoManagementTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetVideoData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record)
	}

	const isEditing = (record: IGetVideoData) => {
		return (
			editingKey?.currencyId === record.currencyId &&
			editingKey.siteId === record.siteId &&
			editingKey.langId === record.langId
		)
	}

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetVideoData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={() => onSaved(record)}>
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
			title: t('Label_Currency'),
			key: 'currencyId',
			dataIndex: 'currencyId',
			width: 100,
			align: 'center' as 'center',
			render: (currencyId: number) => {
				return find(
					currencyListBySite,
					currency => currency.currencyId === currencyId
				)?.isoCode
			},
		},
		{
			title: t('Label_LangId'),
			key: 'langId',
			dataIndex: 'langId',
			width: 100,
			align: 'center' as 'center',
			render: (langId: string) => langId || '-',
		},
		{
			title: t('Label_Title'),
			key: 'title',
			dataIndex: 'title',
			width: 100,
			align: 'center' as 'center',
			editable: true,
			render: (title: string) => title || '-',
		},
		{
			title: t('Label_Link'),
			key: 'link',
			dataIndex: 'link',
			width: 100,
			align: 'center' as 'center',
			editable: true,
			render: (link: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{link || '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 100,
			align: 'center' as 'center',
			render: (operator: string) => operator || '-',
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 100,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{lastUpdateTime
						? moment(lastUpdateTime)
								.utcOffset(timeZoneLocalOffset)
								.format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetVideoData) => ({
				record,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
					dataSource={videoList ?? []}
					columns={mergeColumns}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default VideoManagementTable
