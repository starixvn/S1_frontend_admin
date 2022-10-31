import { numberFormatter } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { Descriptions } from 'antd'
import { ICheckTierRedepositBonusData } from './type'

interface IIssueBonusManagementDpTrxnDescriptionProps {
	tierDepositBonusInfo: ICheckTierRedepositBonusData
}

const IssueBonusManagementDpTrxnDescription = ({
	tierDepositBonusInfo,
}: IIssueBonusManagementDpTrxnDescriptionProps) => {
	const { t } = useTranslation()
	const { depositId, actualDeposit, lockAmount, bonusAmount, rolloverAmount } =
		tierDepositBonusInfo

	return (
		<Descriptions bordered column={2} size='small'>
			<Descriptions.Item label={t('Label_DPTrxnID')}>
				{depositId}
			</Descriptions.Item>
			<Descriptions.Item label=''>{` `}</Descriptions.Item>
			<Descriptions.Item label='Deposit Actural Amount'>
				{numberFormatter.format(actualDeposit)}
			</Descriptions.Item>
			<Descriptions.Item label='Lock Amount'>
				{numberFormatter.format(lockAmount)}
			</Descriptions.Item>
			<Descriptions.Item label='Bonus'>
				{numberFormatter.format(bonusAmount)}
			</Descriptions.Item>
			<Descriptions.Item label='Rollover Amount'>
				{numberFormatter.format(rolloverAmount)}
			</Descriptions.Item>
		</Descriptions>
	)
}

export default IssueBonusManagementDpTrxnDescription
