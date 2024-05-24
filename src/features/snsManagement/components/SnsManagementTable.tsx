/* eslint-disable react/no-unstable-nested-components */

import { FC, useContext, useEffect } from 'react'
import {
	DraggableBodyRow,
	DraggableContainer,
	DragHandle,
	EditableCellRows,
	Table,
} from 'components'
import { FormInstance, Space, Switch, Typography, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { ISNSData } from 'features/snsManagement/type'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { ColumnsType } from 'antd/es/table'
import { SortEnd } from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'
import { tableContext } from 'features/snsManagement/tableContext'

interface ISnsManagementTableProps {
	snsData: ISNSData[]
	form: FormInstance
}

const SnsManagementTable: FC<ISnsManagementTableProps> = ({
	snsData,
	form,
}) => {
	const { t } = useTranslation()

	// get from context
	const {
		loading,
		timeZoneUtcOffset,
		editingKey,
		setEditingKey,
		editPermission,
		handleRowSaved,
		isSortMode,
		sortModeCanceled,
		tableSource,
		setTableSource,
		setEditMode,
	} = useContext(tableContext)

	const onEdit = (record: ISNSData) => {
		form.setFieldsValue({ ...record })

		// because it could be undefined
		if (setEditingKey && setEditMode) {
			setEditingKey(record.id)
			setEditMode(true)
		}
	}

	const isEditing = (record: ISNSData) => record.id === editingKey

	const columns = [
		isSortMode && {
			title: t('Label_Sort'),
			dataIndex: 'sort',
			width: 30,
			align: 'center' as 'center',
			render: () => <DragHandle />,
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: ISNSData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space>
						<Typography.Link onClick={() => handleRowSaved(record)}>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link
							onClick={() => {
								if (setEditMode && setEditingKey) {
									setEditingKey(undefined)
									setEditMode(false)
								}
							}}
						>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={!editPermission?.canUse || isSortMode}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Channel'),
			key: 'channel',
			dataIndex: 'channelName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Title'),
			key: 'title',
			dataIndex: 'title',
			width: 120,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_QRCode'),
			key: 'linkType',
			width: 60,
			align: 'center' as 'center',
			render: (record: ISNSData) => {
				const editable = isEditing(record)
				const { linkType } = record
				return (
					<Space align='center'>
						{editable ? (
							<Form.Item
								name='linkType'
								style={{ margin: 0 }}
								valuePropName='checked'
							>
								<Switch disabled={!editable} />
							</Form.Item>
						) : (
							<Switch checked={linkType} disabled />
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_Main'),
			key: 'mainPageStatus',
			width: 60,
			align: 'center' as 'center',
			render: (record: ISNSData) => {
				const editable = isEditing(record)
				const { mainPageStatus } = record
				return (
					<Space align='center'>
						{editable ? (
							<Form.Item
								name='mainPageStatus'
								style={{ margin: 0 }}
								valuePropName='checked'
							>
								<Switch disabled={!editable} />
							</Form.Item>
						) : (
							<Switch checked={mainPageStatus} disabled />
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_Contact'),
			key: 'contactPageStatus',
			width: 60,
			align: 'center' as 'center',
			render: (record: ISNSData) => {
				const editable = isEditing(record)
				const { contactPageStatus } = record
				return (
					<Space align='center'>
						{editable ? (
							<Form.Item
								name='contactPageStatus'
								style={{ margin: 0 }}
								valuePropName='checked'
							>
								<Switch disabled={!editable} />
							</Form.Item>
						) : (
							<Switch checked={contactPageStatus} disabled />
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_FooterText'),
			key: 'footerStatus',
			width: 60,
			align: 'center' as 'center',
			render: (record: ISNSData) => {
				const editable = isEditing(record)
				const { footerStatus } = record
				return (
					<Space align='center'>
						{editable ? (
							<Form.Item
								name='footerStatus'
								style={{ margin: 0 }}
								valuePropName='checked'
							>
								<Switch disabled={!editable} />
							</Form.Item>
						) : (
							<Switch checked={footerStatus} disabled />
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_AppText'),
			key: 'appPageStatus',
			width: 60,
			align: 'center' as 'center',
			render: (record: ISNSData) => {
				const editable = isEditing(record)
				const { appPageStatus } = record
				return (
					<Space align='center'>
						{editable ? (
							<Form.Item
								name='appPageStatus'
								style={{ margin: 0 }}
								valuePropName='checked'
							>
								<Switch disabled={!editable} />
							</Form.Item>
						) : (
							<Switch checked={appPageStatus} disabled />
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_ContentDeepLink'),
			key: 'link',
			dataIndex: 'link',
			width: 120,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_IOSLink'),
			key: 'iosLink',
			dataIndex: 'iosLink',
			width: 120,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_AndroidLink'),
			key: 'androidLink',
			dataIndex: 'androidLink',
			width: 120,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 200,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{dayjs(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	].filter(Boolean) as ColumnsType<any>

	const mergeColumns = columns.map(col => {
		// @ts-ignore
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: ISNSData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'text',
			}),
		}
	})

	const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		if (oldIndex !== newIndex && setTableSource) {
			const newData = arrayMoveImmutable(
				tableSource.slice(),
				oldIndex,
				newIndex
			).filter((el: any) => !!el)
			setTableSource(newData)
		}
	}

	useEffect(() => {
		if (!loading && setTableSource) {
			setTableSource(snsData)
		}
	}, [loading])

	useEffect(() => {
		// 監聽 cancel 狀態 , 重置 tableSource
		if (sortModeCanceled && setTableSource) {
			setTableSource(snsData)
		}
	}, [sortModeCanceled])

	return (
		<Form form={form} component={false}>
			<Table
				loading={loading}
				// @ts-ignore
				columns={mergeColumns}
				components={{
					body: {
						wrapper: (wrapper: any) => (
							<DraggableContainer {...wrapper} onSortEnd={onSortEnd} />
						),
						row: (row: any) => (
							<DraggableBodyRow {...row} dataSource={tableSource} rowKey='id' />
						),
						cell: EditableCellRows,
					},
				}}
				rowKey='id'
				dataSource={tableSource ?? []}
				pagination={false}
			/>
		</Form>
	)
}

export { SnsManagementTable }
