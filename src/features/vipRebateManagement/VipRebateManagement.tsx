import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { isEmpty, get } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite, selectVipCurrencyListBySite } from 'common/enum'
import { VipRebateManagementFilter } from './VipRebateManagementFilter'
import { VipRebateManagementTable } from './vipRebateManagementTable/VipRebateManagementTable'
import { SetByProductModal } from './setByProductModal/SetByProductModal'
import {
	useGetPeriodArgsQuery,
	useLazyGetRebateGameTypeListQuery,
	useLazyGetRebateInfoQuery,
	useSetBatchGameTypeMutation,
	useSetCategoryMutation,
	useSetPayoutLimitMutation,
	useSetPeriodTypeMutation,
} from './api'
import {
	ErrorTypesLabel,
	GameLevelsEnum,
	GameRebateEditData,
	IGameRebateTableData,
	IGetPeriodResponse,
	IGetRebateGameTypeListResponse,
	IRebateTableData,
} from './type'
import {
	errorsFilterWithIndexes,
	gameTypeRebateTableConverter,
	rebateTableDataConverter,
	valueFormatter,
} from './utils/converters'

const VipRebateManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterEditable, setFilterEditable] = useState(false)
	const [editingCategoryId, setEditingCategoryId] = useState<
		number | undefined
	>()
	const [rebateTableData, setRebateTableData] = useState<
		IRebateTableData[] | []
	>([])
	const [tabActiveKey, setActiveKey] = useState<string | undefined>()
	// 給 promise.all 使用的 loadingState
	const [isMainPageLoading, setMainPageLoading] = useState(false)
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	// * 這邊所使用的是 vip rebate 限定的幣別
	const vipCurrencyListBySite = useAppSelector(selectVipCurrencyListBySite)

	const [form] = Form.useForm()

	const setByProductModal = useModal()
	const [gameTypeTableData, setGameTypeTableData] = useState<
		IGameRebateTableData[]
	>([])

	const {
		data: { data: periodArgs } = {} as IGetPeriodResponse,
		isFetching: isGetPeriodArgsFetching,
	} = useGetPeriodArgsQuery({
		siteId,
	})
	const [setPeriodType, { isLoading: isSetPeriodLoading }] =
		useSetPeriodTypeMutation()
	const [getRebateInfo, { isFetching: isGetRebateInfoFetching }] =
		useLazyGetRebateInfoQuery()
	const [setCategory] = useSetCategoryMutation()
	const [setPayoutLimit] = useSetPayoutLimitMutation()
	const [
		getRebateGameTypeList,
		{
			data: { data: rebateGameTypeList } = {} as IGetRebateGameTypeListResponse,
			isFetching: isGetRebateGameTypeLoading,
		},
	] = useLazyGetRebateGameTypeListQuery()
	const [setBatchGameType, { isLoading: isSetBatchGameTypeLoading }] =
		useSetBatchGameTypeMutation()
	const setMainDatas = async () => {
		if (!vipCurrencyListBySite || !editingCategoryId) return

		const {
			vintageClub,
			silverClub,
			goldClub,
			titaniumClub,
			diamondClub,
			novaClub,
			maxPayout,
			minPayout,
		} = form.getFieldsValue()

		const { currencyId } = queryParams
		const setCategoryPromise = (club: string | number | null, level: number) =>
			setCategory({
				siteId,
				categoryId: editingCategoryId,
				percentage: valueFormatter(club),
				currencyId,
				level,
			}).unwrap()
		const setPayout = setPayoutLimit({
			siteId,
			currencyId,
			categoryId: editingCategoryId,
			minPayout: valueFormatter(minPayout),
			maxPayout: valueFormatter(maxPayout),
		}).unwrap()

		const promises: Array<Promise<void>> = [
			setCategoryPromise(vintageClub, GameLevelsEnum.VintageClub),
			setCategoryPromise(silverClub, GameLevelsEnum.SilverClub),
			setCategoryPromise(goldClub, GameLevelsEnum.GoldClub),
			setCategoryPromise(titaniumClub, GameLevelsEnum.TitaniumClub),
			setCategoryPromise(diamondClub, GameLevelsEnum.DiamondClub),
			setCategoryPromise(novaClub, GameLevelsEnum.NovaClub),
			setPayout,
		]

		setMainPageLoading(true)

		const response = await Promise.allSettled(promises)
		const errors = errorsFilterWithIndexes(response)

		if (errors.length !== 0) {
			errors.forEach(item => {
				const { error, key } = item
				message.error(
					`${t(get(ErrorTypesLabel, key))} : ${
						((error as PromiseRejectedResult)?.reason as Error).message
					} ` || t('System.Label_NotExpectedServerError')
				)
			})
		}
		setMainPageLoading(false)
	}

	const handleGetRebateInfo = async (currencyId: number) => {
		try {
			const data = await getRebateInfo({
				siteId,
				currencyId,
			}).unwrap()
			setRebateTableData(rebateTableDataConverter(data))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetPeriodArgs = async () => {
		const {
			periodDay = 0,
			periodType = 1,
			redeemHours = 5,
		} = form.getFieldsValue()
		try {
			await setPeriodType({
				siteId,
				periodDay,
				periodType,
				redeemHours,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}

		setFilterEditable(false)
	}

	const handleTabsChange = async (key: string) => {
		if (!key) return
		setActiveKey(key)
		setEditingCategoryId(undefined)
		await handleGetRebateInfo(Number(key))
		setQueryParams({
			currencyId: key,
		})
	}

	const handleTableSaved = async () => {
		await setMainDatas()
		setEditingCategoryId(undefined)
		// promise.all 結束手動重取一次 rebateInfo
		const { currencyId } = queryParams
		await handleGetRebateInfo(currencyId)
	}

	const handleSetByProductClicked = async (categoryId: number) => {
		const { currencyId } = queryParams
		setByProductModal.onOpen()
		await getRebateGameTypeList({
			siteId,
			currencyId,
			rebateCategoryId: categoryId,
		})
	}

	const handleSetByProductSaved = async (editRecord: GameRebateEditData[]) => {
		const detail = editRecord.filter(item => item.percentage !== null)
		const { currencyId } = queryParams
		try {
			await setBatchGameType({
				siteId,
				currencyId,
				detail,
			}).unwrap()
			message.success(t('System.Label_SaveSuccess'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!periodArgs) return
		form.setFieldsValue({
			periodType: periodArgs.periodType,
			redeemHours: periodArgs.redeemHours,
			periodDay: periodArgs.periodDay,
		})
		if (isEmpty(queryParams)) {
			// queryString is empty , init fetch and setQueryParams
			if (!vipCurrencyListBySite) return
			setQueryParams({
				currencyId: vipCurrencyListBySite[0].currencyId,
			})
			handleGetRebateInfo(vipCurrencyListBySite[0].currencyId)
		} else {
			const { currencyId } = queryParams
			setActiveKey(currencyId)
			handleGetRebateInfo(Number(currencyId))
		}
	}, [periodArgs])

	useEffect(() => {
		if (isGetRebateGameTypeLoading || !rebateGameTypeList) return
		setGameTypeTableData(gameTypeRebateTableConverter(rebateGameTypeList))
	}, [isGetRebateGameTypeLoading])

	const loading =
		isGetPeriodArgsFetching ||
		isSetPeriodLoading ||
		isGetRebateInfoFetching ||
		isMainPageLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<VipRebateManagementFilter form={form} editable={filterEditable} />
			<VipRebateManagementTable
				loading={loading}
				onTabsChange={handleTabsChange}
				currencyList={vipCurrencyListBySite}
				editPermission={editPermission}
				rebateTableData={rebateTableData}
				form={form}
				editingKey={editingCategoryId}
				setEditingKey={setEditingCategoryId}
				onSaved={handleTableSaved}
				tabActiveKey={tabActiveKey}
				onSetByProduct={handleSetByProductClicked}
				siteId={siteId ?? 0}
			/>
			{setByProductModal.visible && (
				<SetByProductModal
					loading={isGetRebateGameTypeLoading || isSetBatchGameTypeLoading}
					visible={setByProductModal.visible}
					onFinish={handleSetByProductSaved}
					onCancel={() => {
						setGameTypeTableData([])
						setByProductModal.onCancel()
					}}
					gameTypeTableData={gameTypeTableData}
					siteId={siteId ?? 0}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				{!filterEditable && (
					<AffixButtons.Edit onClick={() => setFilterEditable(true)} />
				)}
				{filterEditable && (
					<AffixButtons.Saved
						onClick={handleSetPeriodArgs}
						loading={isSetPeriodLoading}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default VipRebateManagement
