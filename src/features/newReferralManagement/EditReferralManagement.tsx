import { useEffect } from 'react'
import { message, Form } from 'antd'
import paths from 'app/constants/paths'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { AffixButtons } from 'components/AffixButtons'
import { selectUserSite } from 'common/enum'
import { useGetLanguageListQuery } from 'common/service/permissionApi/api'
import {
	specificConverter,
	specificListConverter,
} from 'features/newReferralManagement/utils'
import {
	useLazyGetDepositReferralDetailQuery,
	useSetDepositReferralMutation,
} from 'features/newReferralManagement/api'
import {
	IDepositReferralDetailResponse,
	IEditForm,
} from 'features/newReferralManagement/type'
import ActionForm from 'features/newReferralManagement/common/ActionForm'
import ActionTabs from 'features/newReferralManagement/common/ActionTabs'

const EditReferralManagement = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [form] = Form.useForm<IEditForm>()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { editCurrencyId } = useParams()

	const [
		getDepositReferralDetail,
		{ isFetching: isDepositReferralDetailFetching },
	] = useLazyGetDepositReferralDetailQuery()

	const { data: { data: languageList = [] } = {} } = useGetLanguageListQuery({
		siteId,
		currencyId: Number(editCurrencyId),
	})

	const [setDepositReferral] = useSetDepositReferralMutation()

	const handleCreate = async () => {
		const {
			currencyId,
			depositRewardPercentage,
			minPayout,
			maxPayout,
			specific,
		} = await form.validateFields()

		try {
			const specificList = specificConverter(specific)

			await setDepositReferral({
				siteId,
				currencyId,
				depositRewardPercentage,
				minPayout,
				maxPayout,
				specificList,
			}).unwrap()
			navigate(
				`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.newReferralManagement.root}`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const handleGetDepositReferral = async () => {
			const {
				data: {
					data: depositReferralData,
				} = {} as IDepositReferralDetailResponse,
			} = await getDepositReferralDetail({
				siteId,
				currencyId: Number(editCurrencyId),
			})

			const {
				currencyId,
				depositRewardPercentage,
				minPayout,
				maxPayout,
				specificList,
			} = depositReferralData

			const specific = specificListConverter(specificList)

			form.setFieldsValue({
				currencyId,
				depositRewardPercentage,
				minPayout,
				maxPayout,
				specific,
			})
		}

		form.setFieldsValue({
			currencyId: Number(editCurrencyId),
		})

		handleGetDepositReferral()
	}, [editCurrencyId])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_EditNewReferralManagement')} />

			<ActionForm form={form} />

			<ActionTabs form={form} languageList={languageList} />

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					loading={isDepositReferralDetailFetching}
					onClick={handleCreate}
				/>

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditReferralManagement
