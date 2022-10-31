import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { LayoutContent } from 'app/pages/layout'
import { useGetThirdPartyAccountQuery } from 'features/memberProfile/api'
import { ThirdPartyAccountsTable } from 'features/memberProfile/pages/game/thirdPartyAccounts/ThirdPartyAccountsTable'

const ThirdPartyAccounts = () => {
	const { t } = useTranslation()
	const { custId } = useParams()

	const {
		data: { data: thirdPartyAccounts = [] } = {},
		isLoading: isGetThirdPartyAccountsLoading,
	} = useGetThirdPartyAccountQuery({ custId: Number(custId) })

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Game.Label_3RDPartyAccount')}
			/>
			<ThirdPartyAccountsTable
				loading={isGetThirdPartyAccountsLoading}
				thirdPartyAccounts={thirdPartyAccounts}
			/>
		</>
	)
}

export default ThirdPartyAccounts
