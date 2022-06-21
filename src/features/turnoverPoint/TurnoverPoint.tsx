import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { isEmpty } from 'lodash'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	IGetTpCategoryResponse,
	IGetTurnoverPointSettingListResponse,
} from './type'
import {
	useGetCategoryQuery,
	useLazyGetTurnoverPointSettingListQuery,
} from './api'
import { useQueryParams } from '../../common/hooks'

const TurnoverPoint: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm()
	const [tabActiveKey, setActiveKey] = useState<string | undefined>()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const [
		getTurnoverPointSettingList,
		{
			data: {
				data: turnoverPointSettingList,
			} = {} as IGetTurnoverPointSettingListResponse,
			isFetching: isGetTurnoverPointSettingListFetching,
		},
	] = useLazyGetTurnoverPointSettingListQuery()

	const {
		data: { data: categoryList } = {} as IGetTpCategoryResponse,
		isFetching: isGetCategoryLoading,
	} = useGetCategoryQuery({ siteId })
	useEffect(() => {
		const handleGetTurnoverPointSettingList = async (currencyId: number) => {
			try {
				await getTurnoverPointSettingList({
					siteId,
					currencyId,
				}).unwrap()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
		if (isEmpty(queryParams)) {
			// queryString is empty , init fetch and setQueryParams
			if (!currencyListBySite) return
			const { currencyId } = currencyListBySite[0]
			setQueryParams({
				currencyId,
			})
			handleGetTurnoverPointSettingList(currencyId).catch(error =>
				console.log(error)
			)
		} else {
			const { currencyId } = queryParams
			setActiveKey(currencyId)
			handleGetTurnoverPointSettingList(Number(currencyId)).catch(error =>
				console.log(error)
			)
		}
	}, [])
	useEffect(() => {
		if (isGetTurnoverPointSettingListFetching === false) {
			console.log(turnoverPointSettingList)
		}
		if (isGetCategoryLoading === false) {
			console.log(categoryList)
		}
	}, [isGetTurnoverPointSettingListFetching, isGetCategoryLoading])

	const loading = isGetTurnoverPointSettingListFetching || isGetCategoryLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
		</LayoutContent.Main>
	)
}

export default TurnoverPoint
