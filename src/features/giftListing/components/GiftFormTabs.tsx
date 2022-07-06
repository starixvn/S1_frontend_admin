import { FC, useEffect } from 'react'
import { FormInstance, Tabs } from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useGetLanguageListQuery } from 'common/service/permissionApi/api'
import { useQueryParams } from 'common/hooks'
import { useLazyGetCategoriesQuery, useLazyGetGiftTagsQuery } from '../api'
import GiftListingForm from './GiftListingForm'

const { TabPane } = Tabs

interface GiftFormTabsProps {
	form: FormInstance
	currencyId: number
	pictureUrl?: string | undefined
}

const GiftFormTabs: FC<GiftFormTabsProps> = ({
	form,
	currencyId,
	pictureUrl,
}) => {
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [{ defaultEditLang }] = useQueryParams()

	const {
		data: { data: langCodes = [] } = {},
		isFetching: isGetLanguageListFetching,
	} = useGetLanguageListQuery({ siteId, currencyId })
	const [getCategories, { data: { data: categories = [] } = {} }] =
		useLazyGetCategoriesQuery()
	const [getGiftTags, { data: { data: giftTags = [] } = {} }] =
		useLazyGetGiftTagsQuery()

	// * 獲取下拉選單資料
	useEffect(() => {
		if (!isGetLanguageListFetching && currencyId) {
			getGiftTags({ siteId, currencyId, langCodes })
			getCategories({ siteId, currencyId, langCodes })
		}
	}, [isGetLanguageListFetching])

	return (
		<Tabs type='card' defaultActiveKey={defaultEditLang}>
			{langCodes.map(lang => (
				<TabPane tab={lang} key={lang}>
					<GiftListingForm
						form={form}
						lang={lang}
						categories={categories}
						giftTags={giftTags}
						pictureUrl={pictureUrl}
					/>
				</TabPane>
			))}
		</Tabs>
	)
}

export default GiftFormTabs
