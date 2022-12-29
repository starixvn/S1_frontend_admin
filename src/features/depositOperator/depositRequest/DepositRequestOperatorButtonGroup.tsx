import React from 'react'
import { Col, Row } from 'antd'
import { includes } from 'lodash'
import { useTranslation } from 'react-i18next'
import { OperatorButton } from 'components/OperatorButton/OperatorButton'
import {
	DepositStatusEnum,
	UsableActionButtonEnum,
} from 'features/depositOperator/type'
import { useAuth } from 'common/hooks'

interface IDepositRequestOperatorButtonGroupProps {
	loading?: boolean
	usableActionButtons: number[]
	onSetDepositStatus: (status: DepositStatusEnum) => void
	onShowSendMessageModal: () => void
}

const DepositRequestOperatorButtonGroup = ({
	loading,
	usableActionButtons,
	onSetDepositStatus,
	onShowSendMessageModal,
}: IDepositRequestOperatorButtonGroupProps) => {
	const { t } = useTranslation()
	const {
		actionPermissions: {
			approvedPermission,
			draftPermission,
			manualApprovedPermission,
			onHoldPermission,
			pendingPermission,
			rejectPermission,
			sendMessagePermission,
		} = {},
	} = useAuth()
	return (
		<Row gutter={[16, 16]}>
			{includes(usableActionButtons, UsableActionButtonEnum.Rejected) && (
				<Col span={6}>
					<OperatorButton
						loading={loading}
						disabled={!rejectPermission?.canUse}
						onClick={() => onSetDepositStatus(DepositStatusEnum.Rejected)}
						color='Reject'
					>
						{t('Label_Reject')}
					</OperatorButton>
				</Col>
			)}

			<Col span={6}>
				<OperatorButton
					loading={loading}
					disabled={!sendMessagePermission?.canUse}
					onClick={onShowSendMessageModal}
					color='Blue'
				>
					{t('Label_SendMessage')}
				</OperatorButton>
			</Col>

			{includes(usableActionButtons, UsableActionButtonEnum.Draft) && (
				<Col span={6}>
					<OperatorButton
						loading={loading}
						disabled={!draftPermission?.canUse}
						onClick={() => onSetDepositStatus(DepositStatusEnum.Draft)}
						color='Gray'
					>
						{t('Label_Draft')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButtons, UsableActionButtonEnum.OnHold) && (
				<Col span={6}>
					<OperatorButton
						loading={loading}
						disabled={!onHoldPermission?.canUse}
						onClick={() => onSetDepositStatus(DepositStatusEnum.OnHold)}
						color='Yellow'
					>
						{t('Label_OnHold')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButtons, UsableActionButtonEnum.Pending) && (
				<Col span={6}>
					<OperatorButton
						loading={loading}
						disabled={!pendingPermission?.canUse}
						onClick={() => onSetDepositStatus(DepositStatusEnum.Pending)}
						color='Yellow'
					>
						{t('Label_Pending')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButtons, UsableActionButtonEnum.Approved) && (
				<Col span={6}>
					<OperatorButton
						loading={loading}
						disabled={!approvedPermission?.canUse}
						onClick={() => onSetDepositStatus(DepositStatusEnum.Approved)}
						color='Green'
					>
						{t('Label_Approve')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButtons, UsableActionButtonEnum.ManualApproved) && (
				<Col span={6}>
					<OperatorButton
						loading={loading}
						disabled={!manualApprovedPermission?.canUse}
						onClick={() => onSetDepositStatus(DepositStatusEnum.ManualApproved)}
						color='Purple'
					>
						{t('Label_ManualApproved')}
					</OperatorButton>
				</Col>
			)}
		</Row>
	)
}

export default DepositRequestOperatorButtonGroup
