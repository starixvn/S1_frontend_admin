import { FC } from 'react'
import { Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { OperatorButton } from 'components/OperatorButton/OperatorButton'
import { StatusEnum } from '../../constants'

interface IButtonGroup {
	status: number
	onSetRedemptionInfo: (action: number) => void
	loading: boolean
}

const ButtonGroup: FC<IButtonGroup> = ({
	status,
	onSetRedemptionInfo,
	loading,
}) => {
	const { t } = useTranslation()

	return (
		<>
			<Col span={6}>
				<OperatorButton
					loading={loading}
					onClick={() => onSetRedemptionInfo(StatusEnum.Draft)}
					color='Gray'
				>
					{t('Label_Draft')}
				</OperatorButton>
			</Col>
			{status !== StatusEnum.Approve && status !== StatusEnum.Rejected && (
				<>
					<Col span={6}>
						{status !== StatusEnum.OnHold ? (
							<OperatorButton
								loading={loading}
								onClick={() => onSetRedemptionInfo(StatusEnum.OnHold)}
								color='Yellow'
							>
								{t('Label_OnHold')}
							</OperatorButton>
						) : (
							<OperatorButton
								color='Black'
								loading={loading}
								onClick={() => onSetRedemptionInfo(StatusEnum.Pending)}
							>
								{t('Label_Pending')}
							</OperatorButton>
						)}
					</Col>
					{status !== StatusEnum.OnHold && (
						<>
							<Col span={6}>
								<OperatorButton
									color='Blue'
									loading={loading}
									onClick={() => onSetRedemptionInfo(StatusEnum.Approve)}
								>
									{t('Label_ApproveCheckOut')}
								</OperatorButton>
							</Col>
							<Col span={6}>
								<OperatorButton
									color='Reject'
									loading={loading}
									onClick={() => onSetRedemptionInfo(StatusEnum.Rejected)}
								>
									{t('Label_Reject')}
								</OperatorButton>
							</Col>
						</>
					)}
				</>
			)}
		</>
	)
}

export { ButtonGroup }
