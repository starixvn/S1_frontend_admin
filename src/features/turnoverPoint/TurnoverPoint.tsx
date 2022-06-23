import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { includes, isEmpty } from 'lodash'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import {
	IGetTpCategoryResponse,
	IGetTurnoverPointSettingListResponse,
	IGetTurnoverPointStatusSettingResponse,
	ISetTurnoverPointStatusSettingInfo,
} from './type'
import {
	useGetCategoryQuery,
	useLazyGetTurnoverPointSettingListQuery,
	useLazyGetTurnoverPointStatusSettingQuery,
	useSetTurnoverPointStatusSettingMutation,
} from './api'
import { TurnoverPointStatusModal } from './TurnoverPointStatusModal'
import { TurnoverPointTable } from './TurnoverPointTable'

const TurnoverPoint: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const [tabActiveKey, setActiveKey] = useState<string | undefined>()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const turnoverPointStatusModal = useModal()
	const [modalTitle, setModalTitle] = useState('')
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

	const [
		getTurnoverPointStatusSetting,
		{
			data: {
				data: turnoverPointStatusData,
			} = {} as IGetTurnoverPointStatusSettingResponse,
			isFetching: isGetTurnoverPointStatusFetching,
		},
	] = useLazyGetTurnoverPointStatusSettingQuery()

	const [
		setTurnoverPointStatusSetting,
		{ isLoading: isSetTurnoverPointStatusSettingLoading },
	] = useSetTurnoverPointStatusSettingMutation()

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

	const handleGetTurnoverPointStatusData = async (
		categoryId: number,
		categoryName: string
	) => {
		setModalTitle(categoryName)

		try {
			await getTurnoverPointStatusSetting({
				siteId,
				currencyId: Number(tabActiveKey),
				tpCategoryId: categoryId,
			}).unwrap()
			turnoverPointStatusModal.onOpen()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetTurnoverPointStatusData = async () => {
		const { selectCategoryList } = form.getFieldsValue()

		const getObj = (
			id: number,
			status: boolean
		): ISetTurnoverPointStatusSettingInfo => {
			return {
				tpGameTypeId: id,
				status: Number(status),
			}
		}

		let statusInfo: ISetTurnoverPointStatusSettingInfo[] = []

		if (selectCategoryList.length === turnoverPointStatusData.length) {
			turnoverPointStatusData.forEach(item =>
				statusInfo.push(getObj(item.tpGameTypeId, true))
			)
		} else {
			const unSelectedItems = turnoverPointStatusData
				.filter(item => !includes(selectCategoryList, item.tpGameTypeId))
				.map(infoItem => getObj(infoItem.tpGameTypeId, false))
			const selectedItems = turnoverPointStatusData
				.filter(item => includes(selectCategoryList, item.tpGameTypeId))
				.map(infoItem => getObj(infoItem.tpGameTypeId, true))
			statusInfo = [...selectedItems, ...unSelectedItems]
		}

		try {
			await setTurnoverPointStatusSetting({
				siteId,
				currencyId: Number(tabActiveKey),
				infos: statusInfo,
			}).unwrap()
			message.success(t('System.Label_SaveSuccess'))
			turnoverPointStatusModal.onCancel()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTabsChange = async (key: string) => {
		if (!key) return
		setActiveKey(key)
		await handleGetTurnoverPointSettingList(Number(key))
		setQueryParams({
			currencyId: key,
		})
	}
	useEffect(() => {
		if (isEmpty(queryParams)) {
			// queryString is empty , init fetch and setQueryParams
			if (!currencyListBySite) return
			const { currencyId } = currencyListBySite[0]
			setQueryParams({
				currencyId,
			})
			setActiveKey(currencyId.toString())
			handleGetTurnoverPointSettingList(currencyId)
		} else {
			const { currencyId } = queryParams
			setActiveKey(currencyId)
			handleGetTurnoverPointSettingList(Number(currencyId))
		}
	}, [])

	const loading =
		isGetTurnoverPointSettingListFetching ||
		isGetCategoryLoading ||
		isGetTurnoverPointStatusFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<TurnoverPointTable
				loading={loading}
				onTabsChange={handleTabsChange}
				currencyList={currencyListBySite}
				turnoverTableData={turnoverPointSettingList}
				categoryList={categoryList}
				editPermission={editPermission}
				handleCategoryClick={handleGetTurnoverPointStatusData}
			/>
			<TurnoverPointStatusModal
				loading={
					isGetTurnoverPointStatusFetching ||
					isSetTurnoverPointStatusSettingLoading
				}
				visible={turnoverPointStatusModal.visible}
				onFinish={handleSetTurnoverPointStatusData}
				onCancel={turnoverPointStatusModal.onCancel}
				turnoverPointStatusData={turnoverPointStatusData}
				modalTitle={modalTitle}
				form={form}
			/>
		</LayoutContent.Main>
	)
}

export default TurnoverPoint
