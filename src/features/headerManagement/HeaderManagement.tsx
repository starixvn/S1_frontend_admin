import { head, isEmpty } from 'lodash'
import { useEffect, useRef, useState } from 'react'
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
import { Button, Form, message, Tour, TourProps } from 'antd'
import { IFilterForm, IChildRefs } from 'features/headerManagement/type'
import HeaderManagementFilter from 'features/headerManagement/HeaderManagementFilter'
import HeaderManagementTable from 'features/headerManagement/HeaderManagementTable'
import ProductStatusModal from 'features/headerManagement/Modal/ProductStatusModal'

const HeaderManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [isSortMode, setIsSortMode] = useState(false)

	const productStatusModal = useModal()

	// refs for Tour Component, use forwardsRef and useImparativeHandle to expose the refs
	const buttonRef = useRef<HTMLDivElement>(null)
	const filterRef = useRef<IChildRefs>(null)
	const tableRef = useRef<IChildRefs>(null)
	const statusModalRef = useRef<IChildRefs>(null)

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

	const steps: TourProps['steps'] = [
		{
			target: () => filterRef.current?.ref1 as HTMLElement,
			title: 'Filter Section',
			description: 'Filter for searching results.',
		},
		{
			target: () => filterRef.current?.ref2 as HTMLElement,
			title: 'Currency',
			description: 'Select curreny.',
		},
		{
			target: () => filterRef.current?.ref3 as HTMLElement,
			title: 'Lobby Category',
			description: 'Select lobby category.',
		},
		{
			target: () => filterRef.current?.ref4 as HTMLElement,
			title: 'Search',
			description: 'Click button to search.',
		},
		{
			target: () => tableRef.current?.ref1 as HTMLElement,
			title: 'Filter Results Table',
			description: 'Results will be displayed here.',
		},
		{
			target: () => buttonRef.current as HTMLElement,
			title: 'Sorting',
			cover: (
				<img
					alt='tour.png'
					src='https://i.imgur.com/h14Bsd3.gif'
					referrerPolicy='no-referrer'
				/>
			),
			description: 'Sort the list by dragging the icon.',
		},
		{
			target: () => filterRef.current?.ref5 as HTMLElement,
			title: 'Product Status',
			description: 'Clicks the button the show product status modal.',
		},
		{
			target: () => statusModalRef.current?.ref1 as HTMLElement,
			title: 'Step 7',
			description: 'Check the product status.',
		},
	]

	const [open, setOpen] = useState<boolean>(false)

	const handleonChange = (currentStep: number) => {
		if (currentStep === 4) {
			handleSearch()
		}
		if (currentStep === 7) {
			productStatusModal.onOpen()
		}
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<Button
				type='primary'
				style={{ marginBottom: '20px', background: 'teal' }}
				onClick={() => setOpen(true)}
			>
				Begin Tour
			</Button>

			<HeaderManagementFilter
				ref={filterRef}
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
					ref={tableRef}
					loading={tableLoading}
					isSortMode={isSortMode}
					headerManagementList={headerManagementList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					handleSetSort={handleSetSort}
				/>
			)}

			<ProductStatusModal
				ref={statusModalRef}
				visible={productStatusModal.visible}
				onCancel={productStatusModal.onCancel}
				lobbyCategoryList={lobbyCategoryList}
				editPermission={editPermission}
			/>

			<Tour
				open={open}
				onClose={() => {
					setOpen(false)
					productStatusModal.onCancel()
				}}
				steps={steps}
				onChange={handleonChange}
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

			{/* div for the floating button at right bottom corner */}
			<div
				ref={buttonRef}
				style={{
					position: 'fixed',
					right: '10px',
					bottom: '20px',
					height: '55px',
					width: '55px',
				}}
			>
				{' '}
			</div>
		</LayoutContent.Main>
	)
}

export default HeaderManagement
