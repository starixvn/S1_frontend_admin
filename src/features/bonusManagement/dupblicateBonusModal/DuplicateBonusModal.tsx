import React, { FC } from 'react'
import { Col, Form, FormInstance, Input, Modal, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	IGetBonusListData,
	IGetPromotionTypeData,
} from 'features/bonusManagement/type'
import { Table } from 'components'
import { find } from 'lodash'
import { walletTypeList } from 'features/bonusManagement/constants'

interface IDuplicateBonusProps {
	loading: boolean
	visible: boolean
	onFinish: () => void
	onCancel: () => void
	form: FormInstance
	duplicateRecord?: IGetBonusListData
	promotionList: IGetPromotionTypeData[]
}

const DuplicateBonusModal: FC<IDuplicateBonusProps> = ({
	loading,
	visible,
	onFinish,
	onCancel,
	form,
	duplicateRecord,
	promotionList,
}) => {
	const { t } = useTranslation()
	const { isSpecial } = duplicateRecord ?? {}

	const columns = [
		{
			title: t('Label_PromotionType'),
			key: 'promotionType',
			dataIndex: 'promotionType',
			width: 80,
			align: 'center' as 'center',
			render: (type: number) => {
				const promotionType = find(
					promotionList,
					promotion => promotion.type === type
				)?.promotionTypeName

				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{promotionType ?? 'N/A'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Description'),
			key: 'description',
			dataIndex: 'description',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_WalletType'),
			key: 'walletType',
			dataIndex: 'walletType',
			width: 100,
			align: 'center' as 'center',
			render: (walletType: number) => {
				const displayName = find(
					walletTypeList,
					type => type.value === walletType
				)?.displayName

				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{displayName ? t(displayName) : '-'}
					</Typography.Text>
				)
			},
		},
	]

	return (
		<Modal
			visible={visible}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_DuplicateBonusCode')}
				</div>
			}
			onCancel={onCancel}
			onOk={onFinish}
			confirmLoading={loading}
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					newBonusCode: '',
					newSpecialCode: '',
				}}
			>
				<Row>
					<Col span={24}>
						<Form.Item
							name='newBonusCode'
							label={t('Label_BonusCode')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_BonusCode'),
									}),
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				{isSpecial && (
					<Row>
						<Col span={24}>
							<Form.Item
								name='newSpecialCode'
								label={t('Label_SpecialCode')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_SpecialCode'),
										}),
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>
				)}
			</Form>
			<Table
				columns={columns}
				dataSource={duplicateRecord ? [duplicateRecord] : []}
				pagination={false}
			/>
		</Modal>
	)
}

export { DuplicateBonusModal }
