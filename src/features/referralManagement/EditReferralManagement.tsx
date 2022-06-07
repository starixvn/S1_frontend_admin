import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from 'app/store'
import { message, Form } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { useGetLanguageListQuery } from 'common/service/permissionApi/api'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import paths from 'app/constants/paths'
import { useLazyGetReferralQuery, useSetReferralMutation } from './api'
import { IGetReferralResponse } from './type'
import {
	coverSpecificListToSpecific,
	coverSpecificToSpecificList,
} from './utils'

import ActionForm from './common/ActionForm'
import ActionTabs from './common/ActionTabs'

const EditReferralManagement = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const userSite = useAppSelector(selectUserSite)
	const { editCurrencyId } = useParams()

	const [getReferral, { isFetching: isGetReferralFetching }] =
		useLazyGetReferralQuery()

	const [setReferral] = useSetReferralMutation()

	const { data: { data: languageList } = {} } = useGetLanguageListQuery({
		siteId: userSite?.siteId,
		currencyId: Number(editCurrencyId),
	})

	const handleCreate = async () => {
		await form.validateFields()

		const {
			bonusAmount,
			currencyId,
			invitationLimit,
			agentDeposit,
			agentValidBet,
			referralFreeCredit,
			validBet,
			deposit,
			periodDays,
			specific,
		} = form.getFieldsValue()

		try {
			const specificList = coverSpecificToSpecificList(specific)

			await setReferral({
				siteId: userSite?.siteId,
				currencyId,
				bonusAmount,
				invitationLimit,
				agentDeposit,
				agentValidBet,
				referralFreeCredit,
				deposit,
				validBet,
				periodDays,
				specificList,
			}).unwrap()

			navigate(
				`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.referralManagement.root}`
			)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const handleGetReferral = async () => {
			const { data: { data: referral } = {} as IGetReferralResponse } =
				await getReferral({
					siteId: userSite?.siteId,
					currencyId: Number(editCurrencyId),
				})

			const {
				bonusAmount,
				currencyId,
				invitationLimit,
				agentDeposit,
				agentValidBet,
				referralFreeCredit,
				validBet,
				deposit,
				periodDays,
				specificList,
			} = referral

			const specific = coverSpecificListToSpecific(specificList)

			form.setFieldsValue({
				bonusAmount,
				currencyId,
				invitationLimit,
				agentDeposit,
				agentValidBet,
				referralFreeCredit,
				validBet,
				deposit,
				periodDays,
				specific,
			})
		}

		form.setFieldsValue({
			currencyId: Number(editCurrencyId),
		})

		handleGetReferral()
	}, [editCurrencyId])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_EditReferralManagement')} />

			<ActionForm form={form} />

			<ActionTabs form={form} languageList={languageList ?? []} />

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					loading={isGetReferralFetching}
					onClick={handleCreate}
				/>

				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditReferralManagement
