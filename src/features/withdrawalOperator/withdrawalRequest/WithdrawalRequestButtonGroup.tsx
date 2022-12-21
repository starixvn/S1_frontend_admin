import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import { OperatorButton } from 'components/OperatorButton/OperatorButton'
import { includes } from 'lodash'
import { UsableActionButtonEnum } from 'features/depositOperator/type'
import React from 'react'
import { WithdrawalStatusEnum } from 'features/withdrawalOperator/constants'
import { useAuth } from 'common/hooks'

interface IButtonGroupProps {
	loading: boolean
	usableActionButton: number[]
	onSetWithdrawalRequest: (status: WithdrawalStatusEnum) => void
	onSetManualOperator: (
		action:
			| UsableActionButtonEnum.ManualApproved
			| UsableActionButtonEnum.ManualRejected
	) => void
}
const WithdrawalRequestButtonGroup = ({
	loading,
	usableActionButton,
	onSetWithdrawalRequest,
	onSetManualOperator,
}: IButtonGroupProps) => {
	const { t } = useTranslation()
	// 因為太多 permission , 直接在這邊取
	const {
		actionPermissions: {
			rejectPermission,
			onHoldPermission,
			pendingPermission,
			approvedPermission,
			draftPermission,
			manualRejectPermission,
			manualApprovedPermission,
			verifiedPermission,
			processPermission,
			toKycPermission,
		} = {},
	} = useAuth()

	return (
		<Row gutter={[16, 16]} style={{ marginTop: '20px', marginBottom: '20px' }}>
			{/* 因為 button 數量變化大，用 flex 自行伸縮排版 */}
			{includes(usableActionButton, UsableActionButtonEnum.ManualRejected) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Reject'
						loading={loading}
						disabled={!manualRejectPermission?.canUse}
						onClick={() => {
							onSetManualOperator(UsableActionButtonEnum.ManualRejected)
						}}
					>
						{t('Label_ManualRejected')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.Rejected) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Reject'
						loading={loading}
						disabled={!rejectPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.Rejected)
						}}
					>
						{t('Label_Reject')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.Draft) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Gray'
						loading={loading}
						disabled={!draftPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.Draft)
						}}
					>
						{t('Label_Draft')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.OnHold) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Yellow'
						loading={loading}
						disabled={!onHoldPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.OnHold)
						}}
					>
						{t('Label_OnHold')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.Verified) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Blue'
						loading={loading}
						disabled={!verifiedPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.Verify)
						}}
					>
						{t('Label_Verified')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.Process) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Green'
						loading={loading}
						disabled={!processPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.Process)
						}}
					>
						{t('Label_Process')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.ToKyc) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Purple'
						loading={loading}
						disabled={!toKycPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.ToKyc)
						}}
					>
						{t('Label_ToKyc')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.Pending) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						color='Black'
						loading={loading}
						disabled={!pendingPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.Pending)
						}}
					>
						{t('Label_Pending')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButton, UsableActionButtonEnum.ManualApproved) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						loading={loading}
						onClick={() => {
							onSetManualOperator(UsableActionButtonEnum.ManualApproved)
						}}
						color='Green'
						disabled={!manualApprovedPermission?.canUse}
					>
						{t('Label_ManualApproved')}
					</OperatorButton>
				</Col>
			)}
			{includes(usableActionButton, UsableActionButtonEnum.Approved) && (
				<Col flex='1 auto' style={{ maxWidth: '15vw' }}>
					<OperatorButton
						loading={loading}
						disabled={!approvedPermission?.canUse}
						onClick={() => {
							onSetWithdrawalRequest(WithdrawalStatusEnum.Approved)
						}}
						color='Green'
					>
						{t('Label_Approve')}
					</OperatorButton>
				</Col>
			)}
		</Row>
	)
}

export { WithdrawalRequestButtonGroup }
