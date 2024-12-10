import dayjs from 'dayjs'
import download from 'downloadjs'
import { FC, useEffect } from 'react'
import { Form, message } from 'antd'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { useNavigate } from 'react-router-dom'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import {
	selectBankInfoSysByCurrencyIds,
	useGetBankInfoSysQuery,
} from 'common/service/allDataApi'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import {
	useExportBankTransferAccountMutation,
	useLazyGetBankTransferAccountsQuery,
	useSetBankTransferAccountMutation,
} from './api'
import type { IBankTransferAccountData, IForm } from './type'
import TransferAccountManagementFilter from './TransferAccountManagementFilter'
import TransferAccountManagementTable from './TransferAccountManagementTable'
import TransferAccountManagementModal from './TransferAccountManagementModal'
import { useGetPaymentAgentSelectListQuery } from '../bankCardManagement/api'

const TransferAccountManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const {
		actionPermissions: {
			exportExcelPermission,
			viewPermission,
			editPermission,
		} = {},
	} = useAuth()
	const [form] = Form.useForm<IForm>()
	const navigate = useNavigate()
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const currencyIdsForm = Form.useWatch('currencyIds', form)
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const updateModal = useModal()

	const {
		data: { data: transferChannelEnum = [] } = {},
		isFetching: isGetTransferChannelEnumFetching,
	} = useGetEnumTypeQuery({ enumName: 'TransferChannelEnum' })

	const {
		data: { data: transferAccountStatusEnum = [] } = {},
		isFetching: isGetTransferAccountStatusEnumFetching,
	} = useGetEnumTypeQuery({ enumName: 'TransferAccountStatusEnum' })

	const {
		data: { data: transferAccountPurposeEnum = [] } = {},
		isFetching: isGetTransferAccountPurposeEnumFetching,
	} = useGetEnumTypeQuery({ enumName: 'TransferAccountPurposeEnum' })

	const { bankInfoSys, isFetching: isGetBankInfoSysFetching } =
		useGetBankInfoSysQuery(null, {
			selectFromResult: selectBankInfoSysByCurrencyIds(currencyIdsForm),
			refetchOnMountOrArgChange: true,
		})

	const [
		getBankTransferAccounts,
		{
			data: { data: bankTransferAccounts = [] } = {},
			isFetching: isGetBankTransferAccountsFetching,
		},
	] = useLazyGetBankTransferAccountsQuery()

	const [
		setBankTransferAccount,
		{ isLoading: isSetBankTransferAccountLoading },
	] = useSetBankTransferAccountMutation()

	const [
		exportBankTransferAccount,
		{ isLoading: isExportBankTransferAccountLoading },
	] = useExportBankTransferAccountMutation()

	const {
		data: { data: paymentAgentSelectList = [] } = {},
		isLoading: isGetPaymentAgentSelectListLoading,
	} = useGetPaymentAgentSelectListQuery(null)

	const handleChangeCurrency = (newCurrencyIds: number[]) => {
		if (newCurrencyIds.includes(0)) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(item => item.currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}

	const handleChangeSysIds = (newSysIds: number[]) => {
		form.setFieldsValue({
			sysIds: newSysIds,
		})
	}

	const handleStatusChange = async (record: IBankTransferAccountData) => {
		// BankTransferAccount/Set 的 payload 不需要 agent
		const { agent, ...rest } = record
		try {
			const response = await setBankTransferAccount(rest).unwrap()

			message.success(
				isEmpty(response.message) ? t('System.Label_Success') : response.message
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExportBankTransferAccount = async () => {
		try {
			const {
				currencyIds,
				sysIds,
				channels,
				status,
				purposes = [],
				accountNo,
				agentId,
			} = queryParams

			const blob = await exportBankTransferAccount({
				siteId,
				currencyIds:
					currencyIds?.map((currencyId: string) => Number(currencyId)) ?? [],
				channels: channels
					? channels.map((channel: string) => Number(channel))
					: [],
				sysIds: sysIds ? sysIds.map((sysId: string) => Number(sysId)) : [],
				purposes: (purposes as ('all' | number)[]).includes('all')
					? []
					: purposes.map((purpose: string) => Number(purpose)),
				status: status ? status?.map((value: string) => Number(value)) : [],
				accountNo,
				agentId: agentId ? Number(agentId) : 0,
			}).unwrap()

			download(
				blob,
				`BankTransferAccounts_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSearch = async () => {
		const { purposes, agentId, ...values } = await form.validateFields()

		try {
			await getBankTransferAccounts({
				siteId,
				purposes: (purposes as ('all' | number)[]).includes('all')
					? []
					: (purposes as number[]),
				// 沒選帶0
				agentId: agentId ?? 0,
				...values,
			}).unwrap()
			setQueryParams({
				purposes,
				agentId: agentId ?? 0,
				...values,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isGetTransferChannelEnumFetching ||
		isGetTransferAccountStatusEnumFetching ||
		isGetTransferAccountPurposeEnumFetching ||
		isGetBankInfoSysFetching ||
		isGetPaymentAgentSelectListLoading

	const tableLoading =
		isGetBankTransferAccountsFetching || isSetBankTransferAccountLoading

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) {
				form.setFieldsValue({
					channels: transferChannelEnum.map(({ value }) => value),
					status: transferAccountStatusEnum.map(({ value }) => value),
					purposes: ['all'],
				})
			} else {
				const {
					currencyIds,
					sysIds,
					channels,
					status,
					purposes = [],
					accountNo,
					agentId,
				} = queryParams

				form.setFieldsValue({
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					sysIds: sysIds ? sysIds.map((sysId: string) => Number(sysId)) : [],
					status: status ? status?.map((value: string) => Number(value)) : [],
					channels: channels
						? channels.map((channel: string) => Number(channel))
						: [],
					purposes: (purposes as ('all' | number)[]).includes('all')
						? ['all']
						: purposes.map((purpose: string) => Number(purpose)),
					accountNo,
					agentId: agentId ? Number(agentId) : undefined,
				})

				handleSearch()
			}
		}
		if (!filterLoading) {
			init()
		}
	}, [filterLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<TransferAccountManagementFilter
				loading={isGetBankTransferAccountsFetching}
				form={form}
				transferChannelEnum={transferChannelEnum}
				transferAccountStatusEnum={transferAccountStatusEnum}
				transferAccountPurposeEnum={transferAccountPurposeEnum}
				bankInfoSys={bankInfoSys}
				paymentAgentSelectList={paymentAgentSelectList}
				onChangeCurrency={handleChangeCurrency}
				onChangeSysIds={handleChangeSysIds}
				onSearch={handleSearch}
			/>

			<TransferAccountManagementTable
				loading={tableLoading}
				viewPermission={viewPermission}
				editPermission={editPermission}
				timeZoneUtcOffset={timeZoneUtcOffset}
				bankTransferAccounts={bankTransferAccounts}
				transferChannelEnum={transferChannelEnum}
				transferAccountStatusEnum={transferAccountStatusEnum}
				transferAccountPurposeEnum={transferAccountPurposeEnum}
				onStatusChange={handleStatusChange}
				updateModal={updateModal}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExportBankTransferAccount}
					loading={isExportBankTransferAccountLoading}
				/>
				<AffixButtons.Create
					onClick={() => {
						updateModal.onOpen()
						// * 後端定義新增時 id帶0
						setQueryParams({ editId: '0' })
					}}
				/>
			</AffixButtons>

			<TransferAccountManagementModal
				loading={false}
				visible={updateModal.visible}
				onCancel={() => {
					updateModal.onCancel()
					navigate(
						`/${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.transferAccountManagement.root}`
					)
				}}
			/>
		</LayoutContent.Main>
	)
}

export default TransferAccountManagement
