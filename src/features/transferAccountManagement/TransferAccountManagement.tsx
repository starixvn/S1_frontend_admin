import moment from 'moment'
import download from 'downloadjs'
import { FC, useEffect } from 'react'
import { Form, message } from 'antd'
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
	useGetBankTransferAccountAgentListQuery,
	useLazyGetBankTransferAccountsQuery,
	useSetBankTransferAccountMutation,
} from './api'
import {
	IBankTransferAccountAgentListResponse,
	IBankTransferAccountData,
	IForm,
} from './type'
import TransferAccountManagementFilter from './TransferAccountManagementFilter'
import TransferAccountManagementTable from './TransferAccountManagementTable'
import TransferAccountManagementModal from './TransferAccountManagementModal'

const TransferAccountManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission, editPermission } = {} } =
		useAuth()
	const [form] = Form.useForm<IForm>()
	const navigate = useNavigate()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const currencyIds = Form.useWatch('currencyIds', form)
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
			selectFromResult: selectBankInfoSysByCurrencyIds(currencyIds),
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
		data: {
			data: agentList = [],
		} = {} as IBankTransferAccountAgentListResponse,
	} = useGetBankTransferAccountAgentListQuery({ siteId })

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
		if (newSysIds.includes(0)) {
			form.setFieldsValue({
				sysIds: bankInfoSys?.map(item => item.sysId),
			})
		} else {
			form.setFieldsValue({
				sysIds: newSysIds,
			})
		}
	}

	const handleStatusChange = async (record: IBankTransferAccountData) => {
		try {
			const response = await setBankTransferAccount(record).unwrap()

			message.success(response.message ?? t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExportBankTransferAccount = async () => {
		try {
			const { purposes, ...values } = await form.validateFields()

			const blob = await exportBankTransferAccount({
				siteId,
				purposes: (purposes as (string | number)[]).includes('all')
					? []
					: purposes,
				...values,
			}).unwrap()

			download(
				blob,
				`BankTransferAccounts_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSearch = async () => {
		const { purposes, ...values } = await form.validateFields()

		try {
			await getBankTransferAccounts({
				siteId,
				purposes: (purposes as (string | number)[]).includes('all')
					? []
					: purposes,
				...values,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const enumLoading =
		isGetTransferChannelEnumFetching ||
		isGetTransferAccountStatusEnumFetching ||
		isGetTransferAccountPurposeEnumFetching ||
		isGetBankInfoSysFetching

	const loading =
		isGetBankTransferAccountsFetching || isSetBankTransferAccountLoading

	useEffect(() => {
		if (!enumLoading) {
			form.setFieldsValue({
				channels: transferChannelEnum.map(({ value }) => value),
				status: transferAccountStatusEnum.map(({ value }) => value),
				purposes: ['all'],
				sysIds: bankInfoSys.map(({ sysId }) => sysId),
			})

			handleSearch()
		}
	}, [enumLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<TransferAccountManagementFilter
				loading={enumLoading || loading}
				form={form}
				transferChannelEnum={transferChannelEnum}
				transferAccountStatusEnum={transferAccountStatusEnum}
				transferAccountPurposeEnum={transferAccountPurposeEnum}
				bankInfoSys={bankInfoSys}
				agentList={agentList}
				onChangeCurrency={handleChangeCurrency}
				onChangeSysIds={handleChangeSysIds}
				onSearch={handleSearch}
			/>

			<TransferAccountManagementTable
				loading={loading}
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
