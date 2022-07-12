import { FC, useEffect, useState } from 'react'
import { message } from 'antd'
import { head, includes, isEqual, uniq } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useAuth, useQueryParams } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { arrayMoveImmutable } from 'array-move'
import type { SortEnd } from 'react-sortable-hoc'
import { GIFT_LIST_STATUS_OPTIONS } from '../constants'
import {
	useLazyGetGiftListQuery,
	useUpdateGiftMutation,
	useUpdateGiftSortMutation,
} from '../api'
import GiftListingFilter from './GiftListingFilter'
import GiftListingTable from './GiftListingTable'
import { IGiftData } from '../type'

const allStatuses = Object.values(GIFT_LIST_STATUS_OPTIONS)

const GiftListing: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [queryParams, setQueryParams] = useQueryParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const paramCurrencyId: number = Number(queryParams?.currencyId)
	const [currencyId, setCurrencyId] = useState<number>(() => {
		// * 設置初始 currencyId ，優先權 queryString?.currencyId > currencyListBySite[0] > undefined
		const currencyIds = currencyListBySite.map(item => item.currencyId)
		if (includes(currencyIds, paramCurrencyId)) return paramCurrencyId
		return Number(head(currencyListBySite)?.currencyId) ?? undefined
	})
	const [dataSource, setDataSource] = useState<IGiftData[]>([])
	const [isSortMode, setIsSortMode] = useState(false)

	const [
		getGiftList,
		{ data: { data: giftList = [] } = {}, isFetching: isGetGiftListFetching },
	] = useLazyGetGiftListQuery()

	const [updateGiftMutation, { isLoading: isUpdateGiftLoading }] =
		useUpdateGiftMutation()

	const [updateGiftSort, { isLoading: isUpdateGiftSortLoading }] =
		useUpdateGiftSortMutation()

	//  * status 全選時，才可以編輯排序
	const sortDisabled = queryParams?.status?.length !== allStatuses.length

	// *  初始資料
	const restoreDataSource = () => {
		setDataSource(giftList)
	}

	const toggleSortMode = () => {
		setIsSortMode(prev => !prev)
	}

	const handleSearch = async (values: {
		currencyId: number
		categoryIds: number[]
		tags: number[]
		status: number[]
		giftName: string
	}) => {
		try {
			await getGiftList({
				siteId,
				...values,
			}).unwrap()

			setQueryParams({ ...values })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdateGift = async (record: IGiftData) => {
		const {
			giftId,
			categoryId,
			tags,
			point,
			priceWorth,
			showStock,
			stock,
			sort,
			status,
		} = record

		try {
			await updateGiftMutation({
				giftId,
				categoryId,
				tags: uniq(tags.map(tag => tag.tagId)),
				point,
				priceWorth,
				status: Boolean(status),
				showStock: Boolean(showStock),
				stock,
				sort,
				infos: [] as any,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdateGiftSort = async () => {
		const originIdList = giftList.map(data => data.giftId)
		const sortedIdList = dataSource.map(data => data.giftId)

		if (isEqual(originIdList, sortedIdList)) return

		try {
			await updateGiftSort({
				sortedIdList,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)

			restoreDataSource()
		}
	}

	const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable(
				dataSource.slice(),
				oldIndex,
				newIndex
			).filter((el: any) => !!el)

			setDataSource(newData)
		}
	}

	useEffect(() => {
		if (!isGetGiftListFetching) {
			restoreDataSource()
		}
	}, [isGetGiftListFetching])

	const loading =
		isGetGiftListFetching || isUpdateGiftLoading || isUpdateGiftSortLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<GiftListingFilter
				loading={loading}
				onSearch={handleSearch}
				currencyId={currencyId}
				setCurrencyId={setCurrencyId}
			/>

			<GiftListingTable
				isSortMode={isSortMode}
				currencyId={currencyId}
				dataSource={dataSource}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				editPermission={editPermission}
				onSortEnd={onSortEnd}
				onUpdateGift={handleUpdateGift}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				{isSortMode ? (
					<>
						<AffixButtons.Close
							onClick={() => {
								restoreDataSource()
								toggleSortMode()
							}}
						/>
						<AffixButtons.Saved
							loading={loading}
							onClick={async () => {
								await handleUpdateGiftSort()
								toggleSortMode()
							}}
						/>
					</>
				) : (
					<AffixButtons.Drag disabled={sortDisabled} onClick={toggleSortMode} />
				)}

				<AffixButtons.Create
					loading={loading}
					onClick={() => {
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.addGiftListing.root}/${currencyId}`
						)
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default GiftListing
