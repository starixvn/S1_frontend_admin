import { Form, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { selectUserSite } from 'common/enum'
import {
	IDepositForm,
	IFilterForm,
	IGetBankInfoListResponse,
} from 'features/depositSubmission/type'
import {
	useLazyGetBankInfoListQuery,
	useSubmitDepositMutation,
} from 'features/depositSubmission/api'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { RcFile } from 'antd/es/upload/interface'
import DepositSubmissionForm from 'features/depositSubmission/DepositSubmissionForm'
import DepositSubmissionFilter from 'features/depositSubmission/DepositSubmissionFilter'
import { useAppSelector } from 'app/store'
import { useEffect } from 'react'
import { find, isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAuth, useQueryParams } from 'common/hooks'
import { utcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'

interface IDepositSubmissionProps {
	pageTitle?: string
}

const DepositSubmission = ({ pageTitle }: IDepositSubmissionProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [depositForm] = Form.useForm<IDepositForm>()
	const userName = Form.useWatch('userName', filterForm)
	const sabaId = Form.useWatch('sabaId', filterForm)
	const isButtonAble = Boolean(userName || sabaId)

	const [
		getBankInfoList,
		{
			data: { data: bankInfoList } = {} as IGetBankInfoListResponse,
			isFetching: isGetBankInfoListLoading,
		},
	] = useLazyGetBankInfoListQuery()

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BankCardManagementStatusEnum' })

	const [submitDeposit, { isLoading: isSubmitDepositLoading }] =
		useSubmitDepositMutation()

	const handleSubmit = async () => {
		if (!siteId) return
		const {
			accountNo: formAccountNo,
			bankName,
			accountName: formAccountName,
			amount,
			dateTime,
			referenceNo,
			memo,
		} = await depositForm.validateFields()

		const { currencyId = '', sysId = '' } =
			find(bankInfoList, {
				accountNo: formAccountNo,
				accountName: formAccountName,
			}) ?? {}

		const { receipt: formReceipt } = depositForm.getFieldsValue()
		const formData = new FormData()

		formData.append('Detail[SiteId]', siteId.toString())
		formData.append('Detail[UserName]', userName)
		formData.append('Detail[SabaId]', sabaId ?? '')
		formData.append('Detail[CurrencyId]', currencyId.toString())
		formData.append('Detail[SysId]', sysId.toString())
		formData.append('Detail[BankName]', bankName)
		formData.append('Detail[AccountHolderName]', formAccountName)
		formData.append('Detail[AccountNumber]', formAccountNo)
		formData.append('Detail[Amount]', amount)
		formData.append('Detail[RefId]', referenceNo)
		formData.append(
			'Detail[DepositTime]',
			utcFormatter({
				date: dateTime,
				utcOffset: timeZoneUtcOffset,
			})
		)
		formData.append('Detail[Comment]', memo)
		formData.append('Receipt', formReceipt[0].originFileObj as RcFile)

		if (formReceipt.length === 0) {
			message.error(t('Label_Required', { key: t('Label_Receipt') }))
		}
		try {
			await submitDeposit(formData).unwrap()
			message.success(t('System.Label_Success'))
			depositForm.resetFields()
			depositForm.setFieldsValue({
				receipt: [],
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSearch = async () => {
		if (!siteId) return
		const { userName: formUserName, sabaId: formSabaId } =
			filterForm.getFieldsValue()
		const args = {
			siteId,
			sabaId: formSabaId,
			userName: formUserName,
			// purpose: 1.Deposit, 2.withdrawal，這邊固定帶1
			purpose: 1,
		}
		try {
			await getBankInfoList(args).unwrap()
			setQueryParams({ ...args })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const { sabaId: querySabaId = '', userName: queryUserName = '' } =
				queryParams
			filterForm.setFieldsValue({
				userName: queryUserName,
				sabaId: querySabaId,
			})
			handleSearch()
		}
		init()
	}, [])

	const loading =
		isGetBankInfoListLoading || isGetStatusListLoading || isSubmitDepositLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<DepositSubmissionFilter
				form={filterForm}
				loading={loading}
				isButtonAble={isButtonAble}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<DepositSubmissionForm
					form={depositForm}
					loading={loading}
					bankInfoList={bankInfoList}
					statusList={statusList}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				{!isEmpty(queryParams) && (
					<AffixButtons.Saved
						disabled={!editPermission?.canUse}
						onClick={handleSubmit}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositSubmission
