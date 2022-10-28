import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { LayoutContent } from 'app/pages/layout'
import {
	IGetCustNotesData,
	IGetCustNotesResponse,
} from 'features/memberProfile/type'
import {
	useAddCustNotesMutation,
	useLazyGetCustNotesQuery,
	useSetCustNotesMutation,
} from 'features/memberProfile/api'
import { PAGINATION, useAuth, usePagination } from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { CustomerNotesForm } from 'features/memberProfile/pages/customerInfo/customerNotes/CustomerNotesForm'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { CustomerNotesTable } from 'features/memberProfile/pages/customerInfo/customerNotes/CustomerNotesTable'
import { useEffect, useState } from 'react'
import { NotesMethodEnum } from 'features/memberProfile/constants'

const CustomerNotes = () => {
	const { t } = useTranslation()
	const {
		actionPermissions: { noteDeletePermission, noteEditPermission } = {},
	} = useAuth()
	const notePermissions = { noteDeletePermission, noteEditPermission }
	const { custId } = useParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset } = useTimeZone()
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
	const [addForm] = Form.useForm<{
		note: string
	}>()
	const [editForm] = Form.useForm<{
		note: string
	}>()

	const [
		getCustNotes,
		{
			data: {
				data: custNotes = [],
				rowCount: custNotesTotal = 0,
			} = {} as IGetCustNotesResponse,
			isFetching: isGetCustNoteLoading,
		},
	] = useLazyGetCustNotesQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custNotesTotal,
	})

	const [addCustNotes, { isLoading: isAddCustNotesLoading }] =
		useAddCustNotesMutation()

	const [setCustNotes, { isLoading: isSetCustNotesLoading }] =
		useSetCustNotesMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		try {
			await getCustNotes({
				custId: Number(custId),
				pageNumber: current,
				pageSize,
			}).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		setEditingKey(undefined)
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleAddNote = async () => {
		const { note } = await addForm.validateFields()
		try {
			await addCustNotes({
				siteId,
				custId: Number(custId),
				note,
			}).unwrap()
			addForm.resetFields()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetNote = async (record: IGetCustNotesData) => {
		const { note } = await editForm.validateFields()
		const { id, custId: setCustId } = record
		try {
			await setCustNotes({
				siteId,
				noteId: id,
				custId: setCustId,
				type: NotesMethodEnum.Update,
				note,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteNote = async (record: IGetCustNotesData) => {
		const { id, custId: setCustId } = record
		try {
			await setCustNotes({
				siteId,
				noteId: id,
				custId: setCustId,
				type: NotesMethodEnum.Delete,
				note: '',
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId])

	const loading =
		isGetCustNoteLoading || isAddCustNotesLoading || isSetCustNotesLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_Notes')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<CustomerNotesForm
					form={addForm}
					loading={isAddCustNotesLoading}
					onAddNotes={handleAddNote}
				/>
				<CustomerNotesTable
					loading={loading}
					form={editForm}
					pagination={pagination}
					onTableChange={handleTableChange}
					custNotes={custNotes}
					editingKey={editingKey}
					setEditingKey={setEditingKey}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onDeleteNote={handleDeleteNote}
					onSetNote={handleSetNote}
					notePermissions={notePermissions}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default CustomerNotes
