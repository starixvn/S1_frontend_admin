import { head, isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import {
	useLazyGetHeaderSettingListQuery,
	useGetLobbyCategoryQuery,
	useUpdateHeaderManagementSortMutation,
} from 'features/headerManagement/api'
import { Form, message, Tour } from 'antd'
import { IFilterForm } from 'features/headerManagement/type'
import HeaderManagementFilter from 'features/headerManagement/HeaderManagementFilter'
import HeaderManagementTable from 'features/headerManagement/HeaderManagementTable'
import ProductStatusModal from 'features/headerManagement/Modal/ProductStatusModal'
import FloatButtonLocator from './Tour/components/FloatButtonLocator'
import TourBeginButton from './Tour/components/TourBeginButton'
import useGenerateTourSteps from './Tour/hooks/useGenerateTourSteps'
import {
	HeaderManagementStepEnum,
	headerManagementTour,
} from './Tour/step-configs/headerManagementTour'

const HeaderManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [isSortMode, setIsSortMode] = useState(false)
	const [open, setOpen] = useState<boolean>(false)

	const productStatusModal = useModal()
	// tourSteps
	const steps = useGenerateTourSteps(headerManagementTour)

	const [
		getHeaderManagementList,
		{
			data: { data: headerManagementList = [] } = {},
			isFetching: isGetHeaderManagementFetching,
		},
	] = useLazyGetHeaderSettingListQuery()

	const {
		data: { data: lobbyCategoryList = [] } = {},
		isLoading: isLobbyCategoryListLoading,
	} = useGetLobbyCategoryQuery(null)

	const [
		updateHeaderManagementSort,
		{ isLoading: isUpdateHeaderManagementSortLoading },
	] = useUpdateHeaderManagementSortMutation()

	const handleSearch = async () => {
		if (!siteId) return

		const { currencyId, lobbyCategoryId } = filterForm.getFieldsValue()
		try {
			await getHeaderManagementList({
				siteId,
				currencyId,
				lobbyCategoryId,
			}).unwrap()
			setQueryParams({
				currencyId,
				lobbyCategoryId,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetSort = async (id: number, sort: number) => {
		try {
			await updateHeaderManagementSort({
				id,
				sort,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading = isLobbyCategoryListLoading

	const tableLoading =
		isGetHeaderManagementFetching || isUpdateHeaderManagementSortLoading

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					lobbyCategoryId: Number(head(lobbyCategoryList)?.id),
				})
			} else {
				const { currencyId, lobbyCategoryId } = queryParams
				filterForm.setFieldsValue({
					currencyId: Number(currencyId),
					lobbyCategoryId: Number(lobbyCategoryId),
				})

				handleSearch()
			}
		}
		if (!filterLoading) {
			init()
		}
	}, [filterLoading])

	// 特定步驟邏輯
	const handleonChange = (currentStep: number) => {
		if (currentStep === HeaderManagementStepEnum.AboutHandleSearch) {
			handleSearch()
		}
		if (currentStep === HeaderManagementStepEnum.AboutHandleProductStatus) {
			productStatusModal.onOpen()
		}
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			{/* tour begin button */}
			<TourBeginButton handleClick={() => setOpen(true)} />
			{/* div for the floating button at right bottom corner */}
			<FloatButtonLocator />
			{/* tour component */}
			<Tour
				open={open}
				onClose={() => {
					setOpen(false)
					productStatusModal.onCancel()
				}}
				steps={steps}
				onChange={handleonChange}
			/>

			<HeaderManagementFilter
				loading={isGetHeaderManagementFetching}
				isSortMode={isSortMode}
				form={filterForm}
				editPermission={editPermission}
				lobbyCategoryList={lobbyCategoryList}
				onSearch={handleSearch}
				onSetProductStatus={productStatusModal.onOpen}
			/>

			{!isEmpty(queryParams) && (
				<HeaderManagementTable
					loading={tableLoading}
					isSortMode={isSortMode}
					headerManagementList={headerManagementList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					handleSetSort={handleSetSort}
				/>
			)}

			<ProductStatusModal
				visible={productStatusModal.visible}
				onCancel={productStatusModal.onCancel}
				lobbyCategoryList={lobbyCategoryList}
				editPermission={editPermission}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				{isSortMode ? (
					<AffixButtons.Close onClick={() => setIsSortMode(false)} />
				) : (
					<AffixButtons.Drag
						onClick={() => setIsSortMode(true)}
						disabled={
							!editPermission?.canUse ||
							isSortMode ||
							headerManagementList.length === 0 ||
							isEmpty(queryParams)
						}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default HeaderManagement
