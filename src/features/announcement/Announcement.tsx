import { useEffect } from 'react'
import moment from 'moment/moment'
import { find, isEmpty } from 'lodash'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { IFilterForm, IEditForm } from 'features/announcement/type'
import { announcementConvert } from 'features/announcement/utils'
import {
	useLazyGetAnnouncementListQuery,
	useAddAnnouncementMutation,
	useUpdateAnnouncementMutation,
	useDeleteAnnouncementMutation,
} from 'features/announcement/api'
import AnnouncementTable from 'features/announcement/AnnouncementTable'
import AnnouncementFilter from 'features/announcement/AnnouncementFilter'
import SetAnnouncementModal from 'features/announcement/announcementmodal/SetAnnouncementModal'

const Announcement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	// 避免複寫 filter 的時間區間
	const {
		timeZoneUtcOffset: timeZoneUtcOffsetModal,
		onTimeZoneChange: onTimeZoneChangeModal,
	} = useTimeZone()
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const editModal = useModal()

	const [
		getAnnouncementList,
		{
			data: { data: announcementList = [], rowCount: paginationTotal = 0 } = {},
			isFetching: isGetAnnouncementFetching,
		},
	] = useLazyGetAnnouncementListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal,
	})

	const [addAnnouncement, { isLoading: isAddAnnouncementLoading }] =
		useAddAnnouncementMutation()
	const [updateAnnouncement, { isLoading: isUpdateAnnouncementLoading }] =
		useUpdateAnnouncementMutation()
	const [deleteAnnouncement, { isLoading: isDeleteAnnouncementLoading }] =
		useDeleteAnnouncementMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return
		const { dateRange, status } = await filterForm.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		const ArrayStatus: number[] = []
		if (status === '2') {
			ArrayStatus.push(Number(0), Number(1))
		} else {
			ArrayStatus.push(Number(status))
		}

		try {
			await getAnnouncementList({
				siteIds: [siteId],
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				statuses: ArrayStatus,
			}).unwrap()
			setQueryParams({
				startDate,
				endDate,
				timeZone: timeZoneUtcOffset,
				pageNumber: current,
				pageSize,
				status,
			})
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
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleSetAnnouncementClick = async (id: number | 'Add') => {
		// 用 "Add" 表示新增
		editForm.setFieldsValue({
			id,
		})
		editModal.onOpen()
	}

	const handleDelete = async (id: number) => {
		try {
			await deleteAnnouncement({ id }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAddAnnouncement = async (
		currentTimeZoneUtcOffset = timeZoneUtcOffsetModal
	) => {
		if (!siteId) return
		try {
			const { dateRange, seq, status, isTest, subject, content } =
				await editForm.validateFields()

			const [startTime, endTime] = dateRangeToUtcFormatter(
				dateRange,
				currentTimeZoneUtcOffset
			)

			// fetch api
			try {
				const response = await addAnnouncement({
					announcement: {
						siteId,
						subject: announcementConvert(subject),
						content: announcementConvert(content),
						status: Number(status),
						isTest: Number(isTest),
						seq,
					},
					startTime,
					endTime,
				}).unwrap()
				message.success(response?.message || t('System.Label_Success'))
				editModal.onCancel()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		} catch (error) {
			// 驗證層
			const { errorFields = [] } = error
			// 因只有 en 需要驗證並彈窗 , 故判斷 name.length > 1 ，只要有出現就跳特定 msg
			// name.length > 1 代表是巢狀結構內的資料
			if (
				find(errorFields, (item: any) => {
					const { name = [] } = item ?? {}
					return (name.length as number) > 1
				})
			) {
				message.error(t('Label_EnLangRequiredMsg'))
			}
		}
	}

	const handleUpdateAnnouncement = async (
		currentTimeZoneUtcOffset = timeZoneUtcOffsetModal
	) => {
		if (!siteId) return
		try {
			await editForm.validateFields()
			const { dateRange, id, seq, status, isTest } =
				editForm.getFieldsValue(true)

			const { subject, content } = editForm.getFieldsValue(true)
			const [startTime, endTime] = dateRangeToUtcFormatter(
				dateRange,
				currentTimeZoneUtcOffset
			)

			const response = await updateAnnouncement({
				announcement: {
					id,
					siteId,
					subject: announcementConvert(subject),
					content: announcementConvert(content),
					status: Number(status),
					isTest: Number(isTest),
					seq,
				},
				startTime,
				endTime,
			}).unwrap()
			message.success(response?.message || t('System.Label_Success'))
			editModal.onCancel()
		} catch (error) {
			// 驗證層
			const { errorFields = [] } = error
			// 因只有 en 需要驗證並彈窗 , 故判斷 name.length > 1 ，只要有出現就跳特定 msg
			// name.length > 1 代表是巢狀結構內的資料
			if (
				find(errorFields, (item: any) => {
					const { name = [] } = item ?? {}
					return (name.length as number) > 1
				})
			) {
				message.error(t('Label_EnLangRequiredMsg'))
			}
		}
	}

	const handleSubmitAnnouncement = (isAdd: boolean) => {
		if (isAdd) {
			handleAddAnnouncement(timeZoneUtcOffsetModal)
		} else {
			handleUpdateAnnouncement(timeZoneUtcOffsetModal)
		}
	}

	const tableLoading = isGetAnnouncementFetching || isDeleteAnnouncementLoading

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const { startDate, endDate, pageNumber, pageSize, timeZone, status } =
				queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				status,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<AnnouncementFilter
				filterLoading={isGetAnnouncementFetching}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<AnnouncementTable
					loading={tableLoading}
					pagination={pagination}
					announcementList={announcementList}
					editPermission={editPermission}
					deletePermission={deletePermission}
					onTableChange={handleTableChange}
					onEdit={handleSetAnnouncementClick}
					onDelete={handleDelete}
				/>
			)}

			<SetAnnouncementModal
				open={editModal.visible}
				form={editForm}
				loading={isAddAnnouncementLoading || isUpdateAnnouncementLoading}
				editPermission={editPermission}
				timeZoneUtcOffset={timeZoneUtcOffsetModal}
				onTimeZoneChange={onTimeZoneChangeModal}
				onCancel={editModal.onCancel}
				onFinish={handleSubmitAnnouncement}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					onClick={() => handleSetAnnouncementClick('Add')}
					disabled={!editPermission?.canUse}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default Announcement
