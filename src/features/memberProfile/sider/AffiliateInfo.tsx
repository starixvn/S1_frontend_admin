import React from 'react'
import { Space, Typography } from 'antd'
import { IAffInfo } from 'features/memberProfile/type'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { isNumber } from 'lodash'

const { Text } = Typography

const StyledText = styled(Text)`
	overflow-wrap: anywhere; // 自動換行
`

interface IAffiliateInfoProps {
	affInfo?: null | IAffInfo
}

const AffiliateInfo = ({ affInfo }: IAffiliateInfoProps) => {
	const { t } = useTranslation()
	const {
		revenueName = null,
		revenueShare = null,
		totalPlayers = 0,
		totalEarning = 0,
	} = affInfo ?? {}

	return (
		<Space direction='vertical'>
			<StyledText>{`${t('Label_RevenueGroup')} : ${
				revenueName ?? 'N/A'
			}`}</StyledText>

			<StyledText>{`${t('Label_RevenueShare')} :  ${
				isNumber(revenueShare) ? `${revenueShare} %` : 'N/A'
			}`}</StyledText>

			<StyledText>{`${t('Label_Players')} : ${
				totalPlayers ?? 'N/A'
			}`}</StyledText>

			<StyledText>{`${t('Label_EarningLastMonth')} : ${
				totalEarning ?? 'N/A'
			}`}</StyledText>
		</Space>
	)
}

export { AffiliateInfo }
