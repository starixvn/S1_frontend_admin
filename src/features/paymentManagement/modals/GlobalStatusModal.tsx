import { useTranslation } from 'react-i18next'
import { Col, Form, Modal, Row, Select, Switch, Typography } from 'antd'
import { useEffect, useState } from 'react'
import {
	IGetGlobalStatusData,
	PaymentStatusEnum,
} from 'features/paymentManagement/type'
import { Table } from 'components'
import { PermissionInterface } from 'type'

interface IGlobalStatusModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	editPermission?: PermissionInterface
	editInfoPermission?: PermissionInterface
	payList: IGetGlobalStatusData[]
	onSetStatus: (payId: number, status: boolean) => void
	onEditClick: (record: IGetGlobalStatusData) => void
}

const { Option } = Select

const GlobalStatusModal = ({
	loading,
	visible,
	onCancel,
	payList,
	editPermission,
	editInfoPermission,
	onSetStatus,
	onEditClick,
}: IGlobalStatusModalProps) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm()
	// 監聽當前選擇的 payId
	const payId = Form.useWatch('payId', filterForm)
	// 因有 Filter 可以 在前端篩選內容 , 故另外使用 status 存取資料
	const [modalList, setModalList] = useState<IGetGlobalStatusData[]>([])

	useEffect(() => {
		if (!loading && payList?.length > 0 && payId) {
			if (payId !== 'all') {
				setModalList(payList.filter(pay => pay.payId === payId))
			} else {
				setModalList(payList)
			}
		}
	}, [loading, payId])

	const columns = [
		{
			title: t('Label_Pay'),
			key: 'payName',
			dataIndex: 'payName',
			width: '60%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '20%',
			align: 'center' as 'center',
			render: (record: IGetGlobalStatusData) => {
				const { payId: currentPayId, status } = record
				return (
					<Switch
						disabled={!editPermission?.canUse}
						checked={status === PaymentStatusEnum.True}
						onClick={value => {
							onSetStatus(currentPayId, value)
						}}
					/>
				)
			},
		},
		{
			title: t('Label_Action'),
			key: 'edit',
			width: '20%',
			align: 'center' as 'center',
			render: (record: IGetGlobalStatusData) => {
				return (
					<Typography.Link
						disabled={!editInfoPermission?.canUse}
						onClick={() => onEditClick(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
	]
	return (
		<Modal
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_GlobalStatus')}</div>
			}
			onCancel={onCancel}
			footer={false}
		>
			<Row align='middle' justify='center' style={{ marginBottom: '10px' }}>
				<Typography.Text type='secondary' style={{ textAlign: 'center' }}>
					* {t('Label_StatusHideMsg')}
				</Typography.Text>
			</Row>
			<Row align='middle' justify='center'>
				<Col span={12}>
					<Form
						layout='vertical'
						size='middle'
						form={filterForm}
						initialValues={{
							payId: 'all',
						}}
					>
						<Form.Item name='payId'>
							<Select>
								<Option key='all' value='all'>
									{t('Label_All')}
								</Option>
								{payList?.map(pay => (
									<Option key={pay.payId} value={pay.payId}>
										{pay.payName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Form>
				</Col>
			</Row>
			<Table
				loading={loading}
				columns={columns}
				dataSource={modalList}
				pagination={false}
				scroll={{ y: 400 }}
			/>
		</Modal>
	)
}

export { GlobalStatusModal }
