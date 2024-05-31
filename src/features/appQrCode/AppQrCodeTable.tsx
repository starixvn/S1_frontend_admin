import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { EditableCellRows, Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { Form, FormInstance, Select, Space, Typography } from 'antd'

import {
	IGetAppLinkListData,
	IGetAppTypeEnumData,
	IGetProtocolTypeEnumData,
} from 'features/appQrCode/type'
import dayjs from 'dayjs'
import { PermissionInterface } from 'type'
import { timeFormat } from 'common/utils/format'

interface IAppQrCodeTableProps {
	loading: boolean
	form: FormInstance
	timeZoneUtcOffset: number
	editPermission?: PermissionInterface
	editingKey: string | undefined
	appLinkData: IGetAppLinkListData[]
	AppTypeList: IGetAppTypeEnumData[]
	ProtocolTypeList: IGetProtocolTypeEnumData[]
	setEditingKey: Dispatch<SetStateAction<string | undefined>>
	onRowSaved: () => void
}

const { Option } = Select

const AppQrCodeTable = ({
	loading,
	form,
	timeZoneUtcOffset,
	editPermission,
	editingKey,
	appLinkData,
	AppTypeList,
	ProtocolTypeList,
	setEditingKey,
	onRowSaved,
}: IAppQrCodeTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetAppLinkListData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.key)
	}

	const isEditing = (record: IGetAppLinkListData) => record.key === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetAppLinkListData) => {
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
			title: t('Label_System'),
			key: 'appTypeName',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetAppLinkListData) => {
				const editable = isEditing(record)
				const { appTypeName } = record
				return editable ? (
					<Form.Item name='appTypeName' style={{ margin: 0 }}>
						<Select disabled>
							{AppTypeList.map(({ value, name }) => (
								<Option key={value} value={value}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					appTypeName
				)
			},
		},
		{
			title: t('Label_ProtocolType'),
			key: 'protocolTypeName',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetAppLinkListData) => {
				const editable = isEditing(record)
				const { protocolTypeName } = record
				return editable ? (
					<Form.Item name='protocolTypeName' style={{ margin: 0 }}>
						<Select>
							{ProtocolTypeList.map(({ value, name }) => (
								<Option key={value} value={value}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					protocolTypeName
				)
			},
		},
		{
			title: t('Label_Domain'),
			key: 'domain',
			dataIndex: 'domain',
			width: 300,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 100,
			align: 'center' as 'center',
			render: (lastUpdateUser: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{lastUpdateUser ?? '-'}
				</Typography.Text>
			),
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
						? dayjs(lastUpdateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IGetAppLinkListData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'text',
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
					pagination={false}
					dataSource={appLinkData}
					columns={mergeColumns}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default AppQrCodeTable
