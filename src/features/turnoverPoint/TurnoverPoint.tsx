import { FC, MutableRefObject, useEffect, useRef, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { assign, findIndex, includes, isEmpty } from 'lodash'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import {
	IGetTpCategoryResponse,
	IGetTurnoverPointSettingListResponse,
	IGetTurnoverPointStatusSettingData,
	ISetTurnoverPointStatusSettingInfo,
} from './type'
import {
	useGetCategoryQuery,
	useLazyGetTpGameTypeQuery,
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
	// 用來儲存當前瀏覽的 categoryId
	const categoryIdRef: MutableRefObject<number | undefined> = useRef()
	const [turnoverPointStatusData, setTurnoverPointStatusData] = useState<
		IGetTurnoverPointStatusSettingData[]
	>([])
	// 此動作包含兩隻 api query 動作 ,用自己寫的 loading 避免動畫異常
	const [modalLoading, setModalLoading] = useState(false)

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

	const [getTurnoverPointStatusSetting] =
		useLazyGetTurnoverPointStatusSettingQuery()
	const [getTpGameType] = useLazyGetTpGameTypeQuery()
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
		categoryIdRef.current = categoryId
		setModalLoading(true)
		try {
			const { data: turnoverPointStatus } = await getTurnoverPointStatusSetting(
				{
					siteId,
					currencyId: Number(tabActiveKey),
					tpCategoryId: categoryId,
				}
			).unwrap()
			const { data: tpGameType } = await getTpGameType({
				categoryId,
			}).unwrap()
			const pointStatusData: IGetTurnoverPointStatusSettingData[] =
				tpGameType.map(item => {
					const statusItem: IGetTurnoverPointStatusSettingData = {
						tpGameTypeId: item.type,
						tpGameTypeName: item.typeName,
						status: 0,
					}
					return statusItem
				})
			turnoverPointStatus.forEach(statusData => {
				if (statusData.status === 1) {
					assign(
						pointStatusData[
							findIndex(pointStatusData, {
								tpGameTypeId: statusData.tpGameTypeId,
							})
						],
						{ status: 1 }
					)
				}
			})
			setTurnoverPointStatusData(pointStatusData)
			turnoverPointStatusModal.onOpen()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
		setModalLoading(false)
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
				tpCategoryId: categoryIdRef.current,
			}).unwrap()
			message.success(t('System.Label_SaveSuccess'))
			turnoverPointStatusModal.onCancel()
			categoryIdRef.current = undefined
			setTurnoverPointStatusData([])
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
		modalLoading

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
				tabActiveKey={tabActiveKey}
			/>
			<TurnoverPointStatusModal
				loading={isSetTurnoverPointStatusSettingLoading || modalLoading}
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
