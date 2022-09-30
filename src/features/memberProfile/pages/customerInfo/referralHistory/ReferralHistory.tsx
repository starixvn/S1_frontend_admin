import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { ReferralHistoryTable } from 'features/memberProfile/pages/customerInfo/referralHistory/ReferralHistoryTable'

const ReferralHistory = () => {
	const { t } = useTranslation()
	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_ReferralHistory')}
			/>
			<ReferralHistoryTable />
		</>
	)
}

export default ReferralHistory
