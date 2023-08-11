import { head, add } from 'lodash'
import { useTranslation } from 'react-i18next'
import { numFormatToDigits } from 'common/utils/format'
import { INewReferralHistoryData } from 'features/memberProfile/type'
import { Descriptions, Badge, Space, Popover } from 'antd'

interface INewReferralHistoryDescriptionProps {
	newReferralHistoryList: INewReferralHistoryData[]
	newReferralHistoryTotal: number
}

const NewReferralHistoryDescription = ({
	newReferralHistoryList,
	newReferralHistoryTotal,
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
					label={t('Label_TotalRefereeCountPayout')}
					style={{ whiteSpace: 'nowrap' }}
				>
					{numFormatToDigits(
						head(newReferralHistoryList)?.totalRefereeWithPayoutCount || 0
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
								// 因 numFormatToDigits 轉千分位時會讓 overflowCount 失效
								// 故要完整顯示正確數值理論上 overflowCount 帶超過 1000 便可完整顯示
								overflowCount={1000}
								count={numFormatToDigits(newReferralHistoryTotal || 0)}
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
								// 因 numFormatToDigits 轉千分位時會讓 overflowCount 失效
								// 故要完整顯示正確數值理論上 overflowCount 帶超過 1000 便可完整顯示
								overflowCount={1000}
								count={numFormatToDigits(
									add(
										head(newReferralHistoryList)?.referral_TotalPayoutAmount!,
										head(newReferralHistoryList)
											?.depositReferral_TotalPayoutAmount!
									) || 0
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
