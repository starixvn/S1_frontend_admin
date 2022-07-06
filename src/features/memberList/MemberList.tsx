import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { isEmpty } from 'lodash'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import moment from 'moment'
import download from 'downloadjs'
import { RcFile, UploadFile } from 'antd/es/upload/interface'
import { MemberListFilter } from './MemberListFilter'
import {
	useGetCategoryListQuery,
	useGetSampleFileMutation,
	useGetVipLevelQuery,
	useLazyGetMemberListQuery,
	useSetManualRewardPointMutation,
	useUploadBatchPointMutation,
} from './api'
import {
	IGetCategoryResponse,
	IGetMemberListResponse,
	IGetVipLevelSettingResponse,
	IManualRewardPointArgs,
} from './type'
import { MemberListTable } from './MemberListTable'
import { AddPointModal } from './modals/AddPointModal'
import { AddPointBatchModal } from './modals/AddPointBatchModal'

const MemberList: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const {
		actionPermissions: { editPermission, addPointBatchPermission } = {},
	} = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [range, setRange] = useState({ startTime: '', endTime: '' })
	const addPointModal = useModal()
	const addPointBatchModal = useModal()
	const [addPointSuccess, setAddPointSuccess] = useState(false)
	const [uploadSuccess, setUploadSuccess] = useState(false)

	const {
		data: { data: vipLevelList } = {} as IGetVipLevelSettingResponse,
		isLoading: isGetVipLevelLoading,
	} = useGetVipLevelQuery({ siteId })
	const [
		getMemberList,
		{
			data: {
				data: memberList,
				rowCount: memberListTotal = 0,
			} = {} as IGetMemberListResponse,
			isFetching: isGetMemberListLoading,
		},
	] = useLazyGetMemberListQuery()

	const {
		data: { data: categoryList } = {} as IGetCategoryResponse,
		isLoading: isGetCategoryListLoading,
	} = useGetCategoryListQuery(null)

	const [setManualRewardPoint, { isLoading: isSetManualRewardPointLoading }] =
		useSetManualRewardPointMutation()

	const [getSampleFile, { isLoading: isGetSampleFileLoading }] =
		useGetSampleFileMutation()

	const [uploadBatchPoint, { isLoading: isUploadBatchPointLoading }] =
		useUploadBatchPointMutation()
	const [pagination, setPagination] = usePagination({
		paginationTotal: memberListTotal,
	})

	const handleFilterSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, currencyIds, vipLevels, userName, sabaId } =
			form.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		setRange({ startTime, endTime })
		// 送出時若userName 和 sabaId 均有填寫則噴錯無法送出
		if (!isEmpty(userName) && !isEmpty(sabaId)) {
			message.error(
				t('Label_FieldsOneTime', {
					FieldA: t('Label_MemberId'),
					FieldB: t('Label_SabaId'),
				})
			)
		} else {
			try {
				await getMemberList({
					siteId,
					currencyIds,
					vipLevels,
					userName: userName ?? '',
					tpUserName: sabaId ?? '',
					startTime,
					endTime,
					pageNumber: current,
					pageSize,
				}).unwrap()
				setQueryParams({
					pageNumber: current,
					pageSize,
					startTime,
					endTime,
					userName: userName ?? '',
					tpUserName: sabaId ?? '',
					currencyIds,
					vipLevels,
					timeZone: currentTimeZoneUtcOffset,
				})
				setPagination(prev => ({ ...prev, current, pageSize }))
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleFilterSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleAddPointFinished = async (args: IManualRewardPointArgs) => {
		const { userName, categoryId, point, memo } = args
		try {
			await setManualRewardPoint({
				siteId,
				userName,
				categoryId,
				point,
				memo,
			}).unwrap()
			setAddPointSuccess(true)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAddPointBatchFinished = async (file: UploadFile[]) => {
		if (!siteId || file.length === 0) return
		const formData = new FormData()
		formData.append('SiteId', siteId.toString())
		formData.append('File', file[0] as RcFile)
		try {
			await uploadBatchPoint(formData).unwrap()
			setUploadSuccess(true)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDownloadFile = async () => {
		try {
			const blob = await getSampleFile(null).unwrap()
			download(blob, `AddBatchPoint_Template.xlsx`)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	useEffect(() => {
		if (!vipLevelList || !currencyListBySite) return
		form.setFieldsValue({
			vipLevels: vipLevelList?.map(item => item.level),
			currencyIds: currencyListBySite?.map(item => item.currencyId),
		})

		const init = () => {
			if (isEmpty(queryParams)) return
			const {
				userName = '',
				currencyIds = [],
				vipLevels = [],
				tpUserName = '',
				startTime,
				endTime,
				timeZone,
				pageNumber,
				pageSize,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				userName,
				currencyIds: currencyIds.map((value: string) => Number(value)),
				vipLevels: vipLevels.map((value: string) => Number(value)),
				tpUserName,
			})
			handleFilterSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [isGetVipLevelLoading])

	const loading =
		isGetVipLevelLoading || isGetMemberListLoading || isGetCategoryListLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<MemberListFilter
				form={form}
				loading={loading}
				onSearch={handleFilterSearch}
				onTimeZoneChange={onTimeZoneChange}
				vipLevelList={vipLevelList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
			/>
			{!isEmpty(queryParams) && (
				<MemberListTable
					loading={loading}
					memberListData={memberList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					dateRange={range}
				/>
			)}
			<AddPointModal
				loading={loading || isSetManualRewardPointLoading}
				visible={addPointModal.visible}
				onFinish={handleAddPointFinished}
				onCancel={() => {
					addPointModal.onCancel()
					setAddPointSuccess(false)
				}}
				categoryList={categoryList}
				success={addPointSuccess}
			/>
			<AddPointBatchModal
				loading={isUploadBatchPointLoading}
				visible={addPointBatchModal.visible}
				onFinish={handleAddPointBatchFinished}
				onCancel={() => {
					addPointBatchModal.onCancel()
					setUploadSuccess(false)
				}}
				onDownload={handleDownloadFile}
				downloading={isGetSampleFileLoading}
				success={uploadSuccess}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					onClick={addPointModal.onOpen}
					disabled={!editPermission?.canUse}
				/>
				<AffixButtons.AddBatch
					onClick={addPointBatchModal.onOpen}
					disabled={!addPointBatchPermission?.canUse}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default MemberList
