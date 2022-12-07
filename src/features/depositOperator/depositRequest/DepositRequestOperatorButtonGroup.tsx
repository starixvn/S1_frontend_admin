import React from 'react'
import { Col, Row } from 'antd'
import { includes } from 'lodash'
import { useTranslation } from 'react-i18next'
import { OperatorButton } from 'components/OperatorButton/OperatorButton'

import {
	DepositStatusEnum,
	UsableActionButtonEnum,
} from 'features/depositOperator/type'

interface IDepositRequestOperatorButtonGroupProps {
	usableActionButtons: number[]
	onSetDepositStatus: (status: DepositStatusEnum) => void
}

const DepositRequestOperatorButtonGroup = ({
	usableActionButtons,
	onSetDepositStatus,
}: IDepositRequestOperatorButtonGroupProps) => {
	const { t } = useTranslation()

	return (
		<Row gutter={[16, 16]}>
			{includes(usableActionButtons, UsableActionButtonEnum.Draft) && (
				<Col span={6}>
					<OperatorButton
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
						onClick={() => onSetDepositStatus(DepositStatusEnum.OnHold)}
						color='Yellow'
					>
						{t('Label_OnHold')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButtons, UsableActionButtonEnum.Approved) && (
				<Col span={6}>
					<OperatorButton
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
						onClick={() => onSetDepositStatus(DepositStatusEnum.ManualApproved)}
						color='Purple'
					>
						{t('Label_ManualApproved')}
					</OperatorButton>
				</Col>
			)}

			{includes(usableActionButtons, UsableActionButtonEnum.Rejected) && (
				<Col span={6}>
					<OperatorButton
						onClick={() => onSetDepositStatus(DepositStatusEnum.Rejected)}
						color='Reject'
					>
						{t('Label_Reject')}
					</OperatorButton>
				</Col>
			)}
		</Row>
	)
}

export default DepositRequestOperatorButtonGroup
