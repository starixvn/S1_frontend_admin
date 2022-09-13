import { FC } from 'react'
import { Button, Col } from 'antd'
import { useTranslation } from 'react-i18next'
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
				<Button
					block
					shape='round'
					type='primary'
					ghost
					style={{
						borderColor: '#8c8c8c',
						color: '#8c8c8c',
					}}
					loading={loading}
					onClick={() => onSetRedemptionInfo(StatusEnum.Draft)}
				>
					{t('Label_Draft')}
				</Button>
			</Col>
			{status !== StatusEnum.Approve && status !== StatusEnum.Rejected && (
				<>
					<Col span={6}>
						{status !== StatusEnum.OnHold ? (
							<Button
								block
								shape='round'
								type='primary'
								style={{
									borderColor: '#e8cc10',
									color: '#e8cc10',
								}}
								ghost
								loading={loading}
								onClick={() => onSetRedemptionInfo(StatusEnum.OnHold)}
							>
								{t('Label_OnHold')}
							</Button>
						) : (
							<Button
								block
								shape='round'
								type='primary'
								ghost
								loading={loading}
								onClick={() => onSetRedemptionInfo(StatusEnum.Pending)}
							>
								{t('Label_Pending')}
							</Button>
						)}
					</Col>
					{status !== StatusEnum.OnHold && (
						<>
							<Col span={6}>
								<Button
									block
									shape='round'
									type='primary'
									loading={loading}
									onClick={() => onSetRedemptionInfo(StatusEnum.Approve)}
								>
									{t('Label_ApproveCheckOut')}
								</Button>
							</Col>
							<Col span={6}>
								<Button
									block
									shape='round'
									type='primary'
									danger
									loading={loading}
									onClick={() => onSetRedemptionInfo(StatusEnum.Rejected)}
								>
									{t('Label_Reject')}
								</Button>
							</Col>
						</>
					)}
				</>
			)}
		</>
	)
}

export { ButtonGroup }
