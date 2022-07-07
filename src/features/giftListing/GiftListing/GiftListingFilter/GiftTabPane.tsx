import { FC, useEffect } from 'react'
import { Form, TabPaneProps, Tabs } from 'antd'
import { take, uniq } from 'lodash'
import { useGetLanguageListQuery } from 'common/service/permissionApi/api'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useLazyGetCategoriesQuery, useLazyGetGiftTagsQuery } from '../../api'
import GiftListingForm from './GiftListingForm'
import { GIFT_LIST_STATUS } from '../../constants'

const { TabPane } = Tabs

interface IGiftTabPaneProps extends TabPaneProps {
	loading: boolean
	currencyId: number
	tabActiveKey: string
	onSearch: (values: any) => void
}

const GiftTabPane: FC<IGiftTabPaneProps> = ({
	tab,
	loading,
	onSearch,
	currencyId,
	tabActiveKey,
	...tabPaneProps
}) => {
	const [form] = Form.useForm()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const {
		data: { data: languageList = [] } = {},
		isFetching: isGetLanguageListFetching,
	} = useGetLanguageListQuery({
		siteId,
		currencyId,
	})

	const [
		getCategories,
		{
			data: { data: categories = [] } = {},
			isFetching: isGetCategoriesFetching,
		},
	] = useLazyGetCategoriesQuery()

	const [
		getGiftTags,
		{ data: { data: giftTags = [] } = {}, isFetching: isGetGiftTagsFetching },
	] = useLazyGetGiftTagsQuery()

	const handleCategoryIdsChange = (newCategoryIds: number[]) => {
		const categoryIds = newCategoryIds.includes(0)
			? categories?.map(({ categoryId }) => categoryId)
			: newCategoryIds
		form.setFieldsValue({
			//  * 用 uniq 去除重複的 id
			categoryIds: uniq(categoryIds),
		})
	}

	const handleTagsChange = (newTags: number[]) => {
		const tagIds = newTags.includes(0)
			? giftTags?.map(({ tagId }) => tagId)
			: newTags
		form.setFieldsValue({
			//  * 用 uniq 去除重複的 id
			tags: uniq(tagIds),
		})
	}

	const handleStatusChange = (newStatuses: (number | 'all')[]) => {
		const statuses = newStatuses.includes('all')
			? GIFT_LIST_STATUS?.map(status => status.value)
			: newStatuses
		form.setFieldsValue({
			status: uniq(statuses),
		})
	}

	const handleSearch = async (values: any) => {
		await onSearch({ ...values, currencyId })
	}

	// * 獲取下拉選單資料
	useEffect(() => {
		if (!isGetLanguageListFetching) {
			getGiftTags({ siteId, currencyId, langCodes: languageList })
			getCategories({
				siteId,
				currencyId,
				langCodes: languageList,
			})
		}
	}, [isGetLanguageListFetching])

	// * 當 categoryIds、tags 資料回來後再設定 form 初始值並 first feting
	useEffect(() => {
		if (
			Number(tabActiveKey) === currencyId &&
			!isGetCategoriesFetching &&
			!isGetGiftTagsFetching
		) {
			const categoryIds = categories.map(category => category.categoryId)
			const tagIds = giftTags.map(giftTag => giftTag.tagId)

			form.setFieldsValue({
				categoryIds: uniq(categoryIds),
				tags: take(tagIds),
			})

			handleSearch(form.getFieldsValue())
		}
	}, [tabActiveKey, isGetCategoriesFetching, isGetGiftTagsFetching])

	return (
		<TabPane tab={tab} {...tabPaneProps}>
			<GiftListingForm
				form={form}
				loading={loading}
				categories={categories}
				giftTags={giftTags}
				onCategoryIdsChange={handleCategoryIdsChange}
				onTagsChange={handleTagsChange}
				onStatusChange={handleStatusChange}
				onSearch={handleSearch}
			/>
		</TabPane>
	)
}

export default GiftTabPane
