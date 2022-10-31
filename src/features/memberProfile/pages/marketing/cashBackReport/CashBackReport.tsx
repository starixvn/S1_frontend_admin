import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { LayoutContent } from 'app/pages/layout'
import React, { useState } from 'react'
import {
	useGetPromotionCashBackQuery,
	useLazyGetPromotionDetailQuery,
} from 'features/memberProfile/api'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { IGetPromotionDetailData } from 'features/memberProfile/type'
import { CashBackInfoTable } from 'features/memberProfile/pages/marketing/cashBackReport/CashBackInfoTable'
import { Divider, message } from 'antd'
import { CashBackDetailTable } from 'features/memberProfile/pages/marketing/cashBackReport/CashBackDetailTable'

const CashBackReport = () => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const [currentBonusCode, setCurrentBonusCode] = useState<string | undefined>(
		undefined
	)

	const {
		data: { data: cashBackInfo = [] } = {},
		isLoading: isGetCashBackInfoLoading,
	} = useGetPromotionCashBackQuery({ custId })

	const [
		getPromotionDetail,
		{
			data: {
				data: promotionDetail,
			} = {} as IAxiosResponse<IGetPromotionDetailData>,
			isFetching: isGetPromotionDetailLoading,
		},
	] = useLazyGetPromotionDetailQuery()

	const handleBonusCodeClicked = async (bonusCode: string) => {
		try {
			await getPromotionDetail({ custId, bonusCode }).unwrap()
			setCurrentBonusCode(bonusCode)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = isGetCashBackInfoLoading || isGetPromotionDetailLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Marketing.Label_CashBackReport')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<CashBackInfoTable
					loading={loading}
					cashBackInfo={cashBackInfo}
					onBonusCodeClicked={handleBonusCodeClicked}
				/>
				{promotionDetail && (
					<>
						<Divider />
						<CashBackDetailTable
							loading={isGetPromotionDetailLoading}
							currentBonusCode={currentBonusCode}
							promotionDetail={promotionDetail}
						/>
					</>
				)}
			</LayoutContent.Card>
		</>
	)
}

export default CashBackReport
