import { head } from 'lodash'
import { useTranslation } from 'react-i18next'
import { numFormatToDigits } from 'common/utils/format'
import { INewReferralHistoryData } from 'features/memberProfile/type'
import { Descriptions, Badge, Space, Popover } from 'antd'

interface INewReferralHistoryDescriptionProps {
	newReferralHistoryList: INewReferralHistoryData[]
}

const NewReferralHistoryDescription = ({
	newReferralHistoryList,
}: INewReferralHistoryDescriptionProps) => {
	const { t } = useTranslation()
	return (
		<>
			<Descriptions size='middle' column={2} bordered>
				<Descriptions.Item
					label={t('Label_TotalRefereeCount')}
					style={{ whiteSpace: 'nowrap' }}
				>
					{numFormatToDigits(
						head(newReferralHistoryList)?.depositReferral_TotalRewardCount || 0
					)}
				</Descriptions.Item>
				<Descriptions.Item
					label={t('Label_TotalRewardAmount')}
					style={{ whiteSpace: 'nowrap' }}
				>
					{numFormatToDigits(
						head(newReferralHistoryList)?.depositReferral__TotalRewardAmount ||
							0
					)}
				</Descriptions.Item>
				<Descriptions.Item
					label={t('Label_TotalPayAmount')}
					style={{ whiteSpace: 'nowrap' }}
				>
					{numFormatToDigits(
						head(newReferralHistoryList)?.depositReferral_TotalPayoutAmount || 0
					)}
				</Descriptions.Item>
			</Descriptions>

			<br />

			<Descriptions size='middle' column={2} bordered>
				<Descriptions.Item
					label={t('Label_TotalRefereeCountOldAndNew')}
					style={{ whiteSpace: 'nowrap' }}
				>
					<Space size={1}>
						<Popover
							content={
								<Descriptions size='middle' column={1} bordered>
									<Descriptions.Item
										label={t('Label_Old')}
										style={{ whiteSpace: 'nowrap' }}
									>
										{numFormatToDigits(
											head(newReferralHistoryList)?.referral_TotalRewardCount ||
												0
										)}
									</Descriptions.Item>
									<Descriptions.Item
										label={t('Label_New')}
										style={{ whiteSpace: 'nowrap' }}
									>
										{numFormatToDigits(
											head(newReferralHistoryList)
												?.depositReferral_TotalRewardCount || 0
										)}
									</Descriptions.Item>
								</Descriptions>
							}
							title={false}
							trigger='hover'
							overlayStyle={{ width: '30vw' }}
						>
							<Badge
								showZero
								count={
									head(newReferralHistoryList)?.referral_TotalRewardCount || 0
								}
								style={{ backgroundColor: '#faad14' }}
							/>
						</Popover>
					</Space>
				</Descriptions.Item>
				<Descriptions.Item
					label={t('Label_TotalPayAmountOldAndNew')}
					style={{ whiteSpace: 'nowrap' }}
				>
					<Space size={1}>
						<Popover
							content={
								<Descriptions size='small' column={1} bordered>
									<Descriptions.Item
										label={t('Label_Old')}
										style={{ whiteSpace: 'nowrap' }}
									>
										{numFormatToDigits(
											head(newReferralHistoryList)
												?.referral_TotalPayoutAmount || 0
										)}
									</Descriptions.Item>
									<Descriptions.Item
										label={t('Label_New')}
										style={{ whiteSpace: 'nowrap' }}
									>
										{numFormatToDigits(
											head(newReferralHistoryList)
												?.depositReferral_TotalPayoutAmount || 0
										)}
									</Descriptions.Item>
								</Descriptions>
							}
							title={false}
							trigger='hover'
							overlayStyle={{ width: '30vw' }}
						>
							<Badge
								showZero
								count={numFormatToDigits(
									head(newReferralHistoryList)?.referral_TotalPayoutAmount || 0
								)}
								style={{ backgroundColor: '#faad14' }}
							/>
						</Popover>
					</Space>
				</Descriptions.Item>
			</Descriptions>
		</>
	)
}

export default NewReferralHistoryDescription
