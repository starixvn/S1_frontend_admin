import { FC } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectUserSite } from 'common/enum'
import { IGetReferralsResponse } from './type'
import { useGetReferralsQuery, useUpdateReferralStatusMutation } from './api'

import ReferralManagementTable from './ReferralManagementTable'

const ReferralManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { actionPermissions: { editPermission, setActivePermission } = {} } =
		useAuth()
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const {
		data: { data: referrals } = {} as IGetReferralsResponse,
		isFetching: isReferralsFetching,
	} = useGetReferralsQuery(siteId)

	const [updateReferralStatus] = useUpdateReferralStatusMutation()

	const handleUpdateReferralStatus = async ({
		currencyId,
		status,
	}: {
		currencyId: number
		status: boolean
	}) => {
		try {
			await updateReferralStatus({
				siteId,
				currencyId,
				status,
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			{referrals !== undefined && (
				<ReferralManagementTable
					referrals={referrals ?? []}
					loading={isReferralsFetching}
					editPermission={editPermission}
					setActivePermission={setActivePermission}
					onUpdateReferralStatus={handleUpdateReferralStatus}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ReferralManagement
