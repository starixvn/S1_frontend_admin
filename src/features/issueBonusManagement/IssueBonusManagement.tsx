import { FC, useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import IssueBonusManagementSearchForm from './IssueBonusManagementSearchForm'
import {
	useLazyGetAdjustmentLimitInfoQuery,
	useLazyGetCustInfoDetailsQuery,
} from './api'
import { IAdjustmentLimitResponse, ICustInfoDetailsResponse } from './type'
import IssueBonusManagementInfoContent from './IssueBonusManagementInfoContent'

const IssueBonusManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [isShowInfoForm, setIsShowInfoForm] = useState<boolean>(false)
	const [searchForm] = Form.useForm<{
		userName: string
		sabaId: string
	}>()
	const [infoForm] = Form.useForm<{
		bonusCode: string
	}>()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const userName = Form.useWatch('userName', searchForm)
	const sabaId = Form.useWatch('sabaId', searchForm)

	const [
		getCustInfoDetails,
		{
			data: { data: custInfoDetails } = {} as ICustInfoDetailsResponse,
			isError: isGetCustInfoDetailsError,
			isFetching: isGetCustInfoDetailsFetching,
		},
	] = useLazyGetCustInfoDetailsQuery()

	const handelClear = () => {
		searchForm.resetFields()
		infoForm.resetFields()
	}

	const [
		getAdjustmentLimitInfo,
		{
			data: { data: adjustmentLimitInfo } = {} as IAdjustmentLimitResponse,
			isFetching: isGetAdjustmentLimitInfoFetching,
		},
	] = useLazyGetAdjustmentLimitInfoQuery()

	const handleSearch = async () => {
		if (!siteId) return

		await searchForm.validateFields()

		try {
			const { data } = await getCustInfoDetails({
				siteId,
				userName,
				sabaId,
			}).unwrap()

			await getAdjustmentLimitInfo({
				siteId,
				currencyId: data.currencyId,
			}).unwrap()

			setIsShowInfoForm(true)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!userName && !sabaId) {
			setIsShowInfoForm(false)
		}
	}, [userName, sabaId])
	const loading =
		isGetCustInfoDetailsFetching || isGetAdjustmentLimitInfoFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<IssueBonusManagementSearchForm
				loading={loading}
				searchForm={searchForm}
				onSearch={handleSearch}
			/>
			{isShowInfoForm && !isGetCustInfoDetailsError && (userName || sabaId) && (
				<IssueBonusManagementInfoContent
					infoForm={infoForm}
					custInfoDetails={custInfoDetails}
					adjustmentMax={adjustmentLimitInfo?.adjustmentMax}
					siteId={siteId}
					onClear={handelClear}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default IssueBonusManagement
