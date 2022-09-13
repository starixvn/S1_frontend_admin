import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	IGetAgentListResponse,
	IGetBankCardListData,
	IGetBankCardListResponse,
	IGetBankInfoResponse,
	IGetPointLevelListResponse,
	IGetPurposeEnumResponse,
	IGetSupportChannelEnumResponse,
	IGetStatusEnumResponse,
} from 'features/bankCardManagement/type'
import {
	useGetAgentListQuery,
	useGetBankInfoQuery,
	useGetPointLevelListQuery,
	useGetPurposeEnumQuery,
	useGetStatusEnumQuery,
	useGetSupportChannelEnumQuery,
	useLazyGetBankCardListQuery,
	useSetBankCardMutation,
} from 'features/bankCardManagement/api'
import {
	IVipLevelsResponse,
	useGetVipLevelQuery,
} from 'common/service/allDataApi'
import { BankCardManagementFilterTab } from 'features/bankCardManagement/BankCardManagementFilter/BankCardManagementFilterTab'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { head, isEmpty } from 'lodash'
import { withOutSiteIdParams } from 'common/utils'
import { FilterContext } from 'features/bankCardManagement/filterContext'
import { BankCardManagementTable } from 'features/bankCardManagement/BankCardManagementTable'
import { EditBankCardModal } from 'features/bankCardManagement/EditBankCardModal'
import { concatStrings } from 'features/bankCardManagement/utils'

const BankCardManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [currentCurrency, setCurrentCurrency] = useState<number>(
		head(currencyListBySite)?.currencyId ?? 0
	)
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const [filterForm] = Form.useForm<{
		purposes: Array<number | string>
		statuses: number[]
		sysIds: number[]
		vipLevels: Array<number | string>
		pointLevels: Array<number | string>
		supportChannels: Array<number | string>
		agent: string
		accountNo: string
	}>()

	const [modalForm] = Form.useForm<{
		currency: number
		bankName: string
		accountName: string
		accountNo: string
		minAmount: number
		maxAmount: number
		dailyLimitAmount: number
		purpose: string
		vipLevels: number[]
		status: number
		pointLevels: number[]
		supportChannels: number[]
		qrCodeUrl: string | null
		sort: number
		memo: string
	}>()
	const editBankModal = useModal()
	const [modalRecord, setModalRecord] = useState<
		IGetBankCardListData | undefined
	>(undefined)

	const {
		data: { data: purposeList } = {} as IGetPurposeEnumResponse,
		isLoading: isGetPurposeListLoading,
	} = useGetPurposeEnumQuery(null)

	const {
		data: { data: agentList } = {} as IGetAgentListResponse,
		isLoading: isGetAgentListLoading,
	} = useGetAgentListQuery({ siteId })

	const {
		data: { data: vipLevelList } = {} as IVipLevelsResponse,
		isLoading: isGetVipLevelSettingLoading,
	} = useGetVipLevelQuery({ siteIdForFilter: siteId })

	const {
		data: { data: statusEnumList } = {} as IGetStatusEnumResponse,
		isLoading: isGetStatusEnumLoading,
	} = useGetStatusEnumQuery(null)

	const {
		data: { data: supportChannelList } = {} as IGetSupportChannelEnumResponse,
		isLoading: isGetSupportChannelLoading,
	} = useGetSupportChannelEnumQuery(null)

	const {
		data: { data: bankInfoList } = {} as IGetBankInfoResponse,
		isFetching: isGetBankInfoLoading,
	} = useGetBankInfoQuery(
		{ currencyId: currentCurrency },
		{ refetchOnMountOrArgChange: true }
	)

	const {
		data: { data: pointLevelList } = {} as IGetPointLevelListResponse,
		isFetching: isGetPointLevelLoading,
	} = useGetPointLevelListQuery(
		{ siteId, currencyId: currentCurrency },
		{ refetchOnMountOrArgChange: true }
	)

	const [
		getBankCardList,
		{
			data: {
				data: bankCardListData,
				rowCount: bankCardListTotal = 0,
			} = {} as IGetBankCardListResponse,
			isFetching: isGetBankCardListLoading,
		},
	] = useLazyGetBankCardListQuery()

	const [setBankCard, { isLoading: isSetBankCardLoading }] =
		useSetBankCardMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bankCardListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const {
			purposes: rawPurposes,
			pointLevels: rawPointLevels,
			vipLevels: rawVipLevels,
			supportChannels: rawSupportChannels,
			...args
		} = filterForm.getFieldsValue()

		// 後端希望這四個 args 若是全選則送 [] 給他 , 所以這樣設計
		const purposes = rawPurposes.includes('all')
			? []
			: rawPurposes.map(purpose => Number(purpose))

		const vipLevels = rawVipLevels.includes('all')
			? []
			: rawVipLevels.map(level => Number(level))

		const pointLevels = rawPointLevels.includes('all')
			? []
			: rawPointLevels.map(pointLevel => Number(pointLevel))

		const supportChannels = rawSupportChannels.includes('all')
			? []
			: rawSupportChannels.map(channel => Number(channel))

		try {
			await getBankCardList({
				siteId,
				currencyId: currentCurrency,
				purposes,
				vipLevels,
				pointLevels,
				supportChannels,
				pageNumber: current,
				pageSize,
				...args,
			}).unwrap()

			setQueryParams({
				currencyId: currentCurrency,
				purposes,
				vipLevels,
				pointLevels,
				supportChannels,
				pageNumber: current,
				pageSize,
				...args,
			})

			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleEditClick = (record: IGetBankCardListData) => {
		setModalRecord(record)
		const {
			bankName,
			accountName,
			accountNo,
			minAmount,
			maxAmount,
			dailyLimitAmount,
			purposes,
			vipLevels,
			status,
			pointLevels,
			sort,
			memo,
			supportChannels,
			qrCodeUrl,
		} = record
		const purposeText = concatStrings(purposes)

		modalForm.setFieldsValue({
			currency: currentCurrency,
			bankName,
			accountName,
			accountNo,
			minAmount,
			maxAmount,
			dailyLimitAmount,
			purpose: purposeText,
			vipLevels,
			status,
			pointLevels,
			sort,
			memo: memo || '',
			supportChannels,
			qrCodeUrl,
		})
		editBankModal.onOpen()
	}

	const handleEditBankCard = async () => {
		if (!modalRecord) return
		const {
			currency,
			minAmount = 0,
			maxAmount = 0,
			dailyLimitAmount = 0,
			vipLevels,
			pointLevels,
			sort = 0,
			status,
			memo,
			supportChannels,
			qrCodeUrl,
		} = await modalForm.validateFields()
		const { financialAccountId } = modalRecord
		try {
			const response = await setBankCard({
				siteId,
				financialAccountId,
				currencyId: currency,
				minAmount,
				maxAmount,
				dailyLimitAmount,
				vipLevels,
				pointLevels,
				memo,
				status,
				sort,
				supportChannels,
				qrCodeUrl,
			}).unwrap()

			message.success(response.message ?? t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			// 因為 切換tab 會清空 queryParams 留下 siteID , 所以這樣寫
			if (isEmpty(withOutSiteIdParams(queryParams))) return
			const {
				pageNumber,
				pageSize,
				currencyId,
				purposes,
				statuses,
				sysIds,
				vipLevels,
				pointLevels,
				supportChannels,
				agent = '',
				accountNo = '',
			} = queryParams
			setCurrentCurrency(Number(currencyId))
			// 若當初選 all 的話送的 args 會是空陣列 , 所以 queryParams 拿到的會是 undefined
			filterForm.setFieldsValue({
				accountNo,
				agent,
				purposes: purposes
					? purposes.map((purpose: string) => Number(purpose))
					: ['all'],
				statuses: statuses?.map((status: string) => Number(status)),
				sysIds: sysIds?.map((sysId: string) => Number(sysId)),
				vipLevels: vipLevels
					? vipLevels.map((vipLevel: string) => Number(vipLevel))
					: ['all'],
				pointLevels: pointLevels
					? pointLevels.map((pointLevel: string) => Number(pointLevel))
					: ['all'],
				supportChannels: supportChannels
					? supportChannels.map((channel: string) => Number(channel))
					: ['all'],
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}
		init()
	}, [])

	useEffect(() => {
		const isLoading = isGetPointLevelLoading || isGetBankInfoLoading
		if (!isLoading && isEmpty(withOutSiteIdParams(queryParams))) {
			filterForm.setFieldsValue({
				sysIds: bankInfoList?.map(bank => bank.sysId),
				purposes: ['all'],
				statuses: statusEnumList?.map(status => status.value),
				vipLevels: ['all'],
				pointLevels: ['all'],
				supportChannels: ['all'],
			})
		}
	}, [isGetPointLevelLoading, isGetBankInfoLoading])

	const isFilterLoading =
		isGetPurposeListLoading ||
		isGetAgentListLoading ||
		isGetVipLevelSettingLoading ||
		isGetStatusEnumLoading ||
		isGetBankInfoLoading ||
		isGetPointLevelLoading ||
		isGetSupportChannelLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<FilterContext.Provider
				value={{
					loading: isFilterLoading,
					isSearchLoading: isGetBankCardListLoading,
					onSearch: handleSearch,
					purposeList,
					agentList,
					vipLevelList,
					statusEnumList,
					pointLevelList,
					bankInfoList,
					supportChannelList,
				}}
			>
				<BankCardManagementFilterTab
					currencyListBySite={currencyListBySite}
					form={filterForm}
					setCurrentCurrency={setCurrentCurrency}
					currentCurrency={currentCurrency}
				/>
			</FilterContext.Provider>
			{!isEmpty(withOutSiteIdParams(queryParams)) && (
				<BankCardManagementTable
					loading={isFilterLoading || isGetBankCardListLoading}
					pagination={pagination}
					bankCardList={bankCardListData}
					onTableChange={handleTableChange}
					editPermission={editPermission}
					statusEnumList={statusEnumList}
					onEditClick={handleEditClick}
				/>
			)}
			<EditBankCardModal
				loading={isSetBankCardLoading}
				form={modalForm}
				visible={editBankModal.visible}
				onFinish={handleEditBankCard}
				onCancel={editBankModal.onCancel}
				currencyListBySite={currencyListBySite}
				vipLevelList={vipLevelList}
				statusEnumList={statusEnumList}
				supportChannelsList={supportChannelList}
				pointLevelList={pointLevelList}
			/>
		</LayoutContent.Main>
	)
}

export default BankCardManagement
