import { head, isEmpty } from 'lodash'
import {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
} from 'react'
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
import { Button, Form, message, Tour } from 'antd'
import { IFilterForm } from 'features/headerManagement/type'
import HeaderManagementFilter from 'features/headerManagement/HeaderManagementFilter'
import HeaderManagementTable from 'features/headerManagement/HeaderManagementTable'
import ProductStatusModal from 'features/headerManagement/Modal/ProductStatusModal'
import ChildComponent from './TestChild'

const HeaderManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [isSortMode, setIsSortMode] = useState(false)
	const buttonRef = useRef<HTMLDivElement>(null)
	const ref1 = useRef<HTMLDivElement>(null)
	const ref2 = useRef<HTMLDivElement>(null)
	const ref3 = useRef<HTMLDivElement>(null)

	const childref = useRef<HTMLDivElement>(null)

	const productStatusModal = useModal()

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

	const steps = [
		{
			target: () => buttonRef.current,
			title: t('Guide.BackToTop.Title'),
			description: t('Guide.BackToTop.Description'),
		},
		{
			target: () => childref.current,
			title: t('Guide.BackToTop.Title'),
			description: t('Guide.BackToTop.Description'),
		},
	]

	const [open, setOpen] = useState<boolean>(false)

	const handleTourChange = (current: number) => {
		if (current === 1) {
			showModal()
		}
	}

	const [isModalOpen, setIsModalOpen] = useState(false)

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	useEffect(() => {
		// 访问DOM节点
		console.log(childref.current) // 输出：<div>...</div>
	})

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<Button type='primary' onClick={() => setOpen(true)}>
				Begin Tour
			</Button>

			<div ref={ref1}>123</div>
			<div ref={ref2}>123</div>
			<div ref={ref3}>123</div>

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

			<ChildComponent
				ref={childref}
				isModalOpen={isModalOpen}
				showModal={showModal}
				handleOk={handleOk}
				handleCancel={handleCancel}
			/>

			<Tour
				open={open}
				onClose={() => setOpen(false)}
				steps={steps}
				onChange={handleTourChange}
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
			<div
				ref={buttonRef}
				style={{
					position: 'fixed',
					backgroundColor: 'aqua',
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
