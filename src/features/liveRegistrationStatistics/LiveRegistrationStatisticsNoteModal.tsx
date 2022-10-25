import moment from 'moment'
import { FC, useEffect, useState } from 'react'
import {
	Button,
	Col,
	Form,
	Input,
	message,
	Modal,
	Popconfirm,
	Row,
	Space,
	Table,
	Typography,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ModalState } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { timeFormat } from 'common/utils/format'
import { timeZoneLocalOffset } from 'common/utils'
import { EditableCellRows } from 'components'
import {
	useAddRegistrationManagementNoteMutation,
	useDeleteRegistrationManagementNoteMutation,
	useEditRegistrationManagementNoteMutation,
	useGetRegistrationManagementNotesQuery,
} from './api'
import {
	IRegistrationManagementNoteData,
	IRegistrationManagementNoteResponse,
} from './type'

const LiveRegistrationStatisticsNoteModal: FC<{
	noteCustId?: number
	modal: ModalState
}> = ({ noteCustId, modal }) => {
	const { visible, onCancel } = modal
	const { t } = useTranslation()

	const [editForm] = Form.useForm<IRegistrationManagementNoteData>()

	const [form] = Form.useForm<{
		note: string
	}>()

	const [editingKey, setEditingKey] = useState<number>()

	const {
		refetch,
		isFetching: isGetRegistrationManagementNotesFetching,
		data: {
			data: registrationManagementNotes = [],
		} = {} as IRegistrationManagementNoteResponse,
	} = useGetRegistrationManagementNotesQuery({ custId: noteCustId })

	const [
		addRegistrationManagementNote,
		{ isLoading: isAddRegistrationManagementNoteLoading },
	] = useAddRegistrationManagementNoteMutation()

	const [
		deleteRegistrationManagementNote,
		{ isLoading: isDeleteRegistrationManagementNoteLoading },
	] = useDeleteRegistrationManagementNoteMutation()

	const [
		editRegistrationManagementNote,
		{ isLoading: isEditRegistrationManagementNoteLoading },
	] = useEditRegistrationManagementNoteMutation()

	const handleAddNote = async () => {
		if (!noteCustId) return
		const { note } = await form.validateFields()
		try {
			await addRegistrationManagementNote({
				custId: noteCustId,
				note,
			}).unwrap()

			form.resetFields()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteNote = async (id: number) => {
		if (!noteCustId) return
		try {
			await deleteRegistrationManagementNote({
				custId: noteCustId,
				id,
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const onSaved = async (record: IRegistrationManagementNoteData) => {
		if (!noteCustId) return
		const { note } = await editForm.validateFields()
		const { id } = record
		try {
			await editRegistrationManagementNote({
				custId: noteCustId,
				note,
				id,
			}).unwrap()
			setEditingKey(undefined)
			editForm.resetFields()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const onEdit = (record: IRegistrationManagementNoteData) => {
		editForm.setFieldsValue(record)
		setEditingKey(record.id)
	}

	const isEditing = (record: IRegistrationManagementNoteData) =>
		record.id === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (record: IRegistrationManagementNoteData) => {
				const editable = isEditing(record)

				return (
					<Space>
						{editable ? (
							<>
								<Typography.Link onClick={() => onSaved(record)}>
									{t('Label_Save')}
								</Typography.Link>
								<Typography.Link onClick={() => setEditingKey(undefined)}>
									{t('Label_Cancel')}
								</Typography.Link>
							</>
						) : (
							<>
								<Typography.Link onClick={() => onEdit(record)}>
									{t('Label_Edit')}
								</Typography.Link>

								<Popconfirm
									title={t('Label_SureToDelete')}
									onConfirm={() => handleDeleteNote(record.id)}
								>
									<Typography.Link>{t('Label_Delete')}</Typography.Link>
								</Popconfirm>
							</>
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_Note'),
			key: 'note',
			dataIndex: 'note',
			width: 80,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 80,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime
					? moment(updateTime).utcOffset(timeZoneLocalOffset).format(timeFormat)
					: '',
		},
	]

	const mergedColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IRegistrationManagementNoteData) => ({
				record,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	const loading =
		isGetRegistrationManagementNotesFetching ||
		isEditRegistrationManagementNoteLoading ||
		isAddRegistrationManagementNoteLoading ||
		isDeleteRegistrationManagementNoteLoading

	useEffect(() => {
		if (visible) {
			refetch()
		} else {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			width={600}
			title={t('Label_Note')}
			onCancel={onCancel}
			footer={null}
		>
			<Form form={form} onFinish={handleAddNote}>
				<Row align='middle' gutter={16}>
					<Col span={22}>
						<Form.Item
							name='note'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Note'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={2}>
						<Form.Item>
							<Button
								loading={loading}
								icon={<PlusOutlined />}
								htmlType='submit'
								type='primary'
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<br />

			<Form form={editForm} component={false}>
				<Table
					size='small'
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					loading={loading}
					columns={mergedColumns}
					dataSource={registrationManagementNotes}
				/>
			</Form>
		</Modal>
	)
}

export default LiveRegistrationStatisticsNoteModal
