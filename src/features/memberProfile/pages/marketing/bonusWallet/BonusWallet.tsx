import React from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useGetBonusWalletInfoQuery } from 'features/memberProfile/api'
import { useParams } from 'react-router-dom'
import { BonusWalletTable } from 'features/memberProfile/pages/marketing/bonusWallet/BonusWalletTable'

const BonusWallet = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)

	const {
		// * 固定回傳長度 1 的資料陣列
		data: { data: bonusWalletInfos = [] } = {},
		isFetching: isGetBonusWalletInfoFetching,
	} = useGetBonusWalletInfoQuery({ custId })

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Marketing.Label_BonusWallet')}
			/>
			<LayoutContent.Card>
				<BonusWalletTable
					loading={isGetBonusWalletInfoFetching}
					bonusWalletInfos={bonusWalletInfos}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default BonusWallet
