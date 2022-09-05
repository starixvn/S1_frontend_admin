import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useAuth } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { head } from 'lodash'
import {
	useLazyGetWithdrawalCryptoLimitListQuery,
	useLazyGetWithdrawalLimitListQuery,
	useUpdateWithdrawalCryptoLimitMutation,
	useUpdateWithdrawalLimitMutation,
} from 'features/withdrawalLimitation/api'
import {
	IGetWithdrawalLimitCryptoData,
	IGetWithdrawalLimitData,
	IWithdrawalLimitationTableData,
} from 'features/withdrawalLimitation/type'
import { WithdrawalLimitationTab } from 'features/withdrawalLimitation/WithdrawalLimitationTab'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	limitationResponseConverter,
	updateCryptoLimitRequestConverter,
	updateLimitRequestConverter,
} from 'features/withdrawalLimitation/utils'

const WithdrawalLimitation: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [currentCurrency, setCurrentCurrency] = useState<number>(
		head(currencyListBySite)?.currencyId ?? 0
	)

	const [limitTableData, setLimitTableData] = useState<
		IWithdrawalLimitationTableData[]
	>([])

	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
	const [editForm] = Form.useForm<{
		times: number
		withdrawalMin: number
		totalWithdrawalMax: number
		UsdtErcMin: number
		UsdtTrcMin: number
		UsdcErcMin: number
		UsdcTrcMin: number
		EthMin: number
		BtcMin: number
	}>()

	const [getWithdrawalLimitList, { isFetching: isGetLimitLoading }] =
		useLazyGetWithdrawalLimitListQuery()

	const [
		getWithdrawalCryptoLimitList,
		{ isFetching: isGetCryptoLimitLoading },
	] = useLazyGetWithdrawalCryptoLimitListQuery()

	const [
		updateWithdrawalCryptoLimit,
		{ isLoading: isUpdateCryptoLimitLoading },
	] = useUpdateWithdrawalCryptoLimitMutation()

	const [updateWithdrawalLimit, { isLoading: isUpdateLimitLoading }] =
		useUpdateWithdrawalLimitMutation()

	const handleGetData = async () => {
		try {
			// 用 promise 減少 isLoading 頻繁切換
			const withdrawalData = await Promise.all([
				getWithdrawalLimitList({
					currencyId: currentCurrency,
					siteId,
				}).unwrap(),
				getWithdrawalCryptoLimitList({
					currencyId: currentCurrency,
					siteId,
				}).unwrap(),
			])
			// currency List
			const { data: withdrawalLimitData = [] as IGetWithdrawalLimitData[] } =
				withdrawalData[0]

			// Crypto List
			const {
				data: withdrawalCryptoLimitData = [] as IGetWithdrawalLimitCryptoData[],
			} = withdrawalData[1]

			const convertedData = limitationResponseConverter({
				limitList: withdrawalLimitData,
				cryptoLimitList: withdrawalCryptoLimitData,
			})
			setLimitTableData(convertedData)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableRowSave = async (record: IWithdrawalLimitationTableData) => {
		const {
			withdrawalMin,
			totalWithdrawalMax,
			times,
			...cryptoWithdrawalSetting
		} = await editForm.validateFields()

		const withdrawalLimitRequest = updateLimitRequestConverter({
			record,
			limitValue: { withdrawalMin, times, totalWithdrawalMax },
		})

		const withdrawalCryptoLimitRequest = updateCryptoLimitRequestConverter({
			record,
			limitValue: { ...cryptoWithdrawalSetting },
		})

		try {
			await Promise.all([
				updateWithdrawalLimit({
					siteId,
					currencyId: currentCurrency,
					...withdrawalLimitRequest,
				}).unwrap(),
				updateWithdrawalCryptoLimit({
					siteId,
					currencyId: currentCurrency,
					...withdrawalCryptoLimitRequest,
				}).unwrap(),
			])

			message.success(t('System.Label_Success'))

			// 因為這頁 是由兩隻 api 組合起來 , 所以沒有使用 tags 去觸發 reFetch , 在成功後手動reFetch 可確保 table 畫面正確顯示
			// refetch 完成後才關閉 editing 狀態 確保table 不會顯示到舊資料
			await handleGetData()
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (currentCurrency) {
			handleGetData()
		}
	}, [currentCurrency])

	const isLoading =
		isGetCryptoLimitLoading ||
		isGetLimitLoading ||
		isUpdateCryptoLimitLoading ||
		isUpdateLimitLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalLimitationTab
				loading={isLoading}
				currentCurrency={currentCurrency}
				form={editForm}
				setCurrentCurrency={setCurrentCurrency}
				currencyListBySite={currencyListBySite}
				editPermission={editPermission}
				editingKey={editingKey}
				setEditingKey={setEditingKey}
				onTableRowSave={handleTableRowSave}
				withdrawalTableData={limitTableData}
			/>
		</LayoutContent.Main>
	)
}

export default WithdrawalLimitation
