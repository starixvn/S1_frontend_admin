import { Descriptions } from 'antd'
import { numberFormatter } from 'common/utils/format'
import { uniqueId } from 'lodash'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { BonusTypeEnum, PromotionTypeEnum, WalletTypeEnum } from './constants'
import { ICheckBonusCodeData } from './type'

const IssueBonusManagementBonusDescription = ({
	bonusCodeInfo,
}: {
	bonusCodeInfo: ICheckBonusCodeData
}) => {
	const { t } = useTranslation()

	const {
		promotionType,
		bonusCode,
		bonusType,
		walletType,
		name: productCategory,
		tierAmountList,
	} = bonusCodeInfo ?? {}

	const walletTypeDisplayKey = () => {
		if (walletType === WalletTypeEnum.Transfer) return t('Label_Transfer')

		if (walletType === WalletTypeEnum.Seamless) return t('Label_Seamless')

		return 'N/A'
	}

	const isAmount =
		promotionType === PromotionTypeEnum.ReDeposit &&
		bonusType === BonusTypeEnum.Amount

	const isPercentage =
		promotionType === PromotionTypeEnum.ReDeposit &&
		bonusType === BonusTypeEnum.Percentage

	const column = isPercentage ? 5 : 4
	return (
		<>
			<Descriptions bordered column={column}>
				<Descriptions.Item label='BonusCode' span={column}>
					{bonusCode}
				</Descriptions.Item>
				<Descriptions.Item label='WalletType' span={column}>
					{walletTypeDisplayKey()}
				</Descriptions.Item>
				<Descriptions.Item label='ProductCategory' span={column}>
					{productCategory}
				</Descriptions.Item>

				{isAmount &&
					tierAmountList?.map(
						({ requiredAmount, bonus, rollOver, winOver }) => (
							<Fragment key={uniqueId()}>
								<Descriptions.Item label={t('Label_RequiredAmount')}>
									{numberFormatter.format(requiredAmount)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_Bonus')}>
									{numberFormatter.format(bonus)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_Rollover')}>
									{rollOver}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_Winover')}>
									{winOver}
								</Descriptions.Item>
							</Fragment>
						)
					)}

				{isPercentage &&
					tierAmountList?.map(
						({
							requiredAmount,
							bonus,
							maxBonus,
							rollOver: percentageRollover,
							winOver: percentageWinOver,
						}) => (
							<Fragment key={uniqueId()}>
								<Descriptions.Item label={t('Label_Bonus')}>
									{numberFormatter.format(bonus)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_MaxBonus')}>
									{numberFormatter.format(maxBonus)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_RequiredAmount')}>
									{numberFormatter.format(requiredAmount)}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_Rollover')}>
									{percentageRollover}
								</Descriptions.Item>
								<Descriptions.Item label={t('Label_Winover')}>
									{percentageWinOver}
								</Descriptions.Item>
							</Fragment>
						)
					)}
			</Descriptions>

			<br />
		</>
	)
}

export default IssueBonusManagementBonusDescription
