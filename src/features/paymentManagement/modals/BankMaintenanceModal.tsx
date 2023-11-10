import { Table } from 'components'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import { Currency } from 'common/enum/type'
import { Col, Form, Modal, Row, Select, Switch } from 'antd'
import { ISystemBankInfoData } from 'features/paymentManagement/type'

interface IBankMaintenanceModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	currencyListBySite: Currency[]
	editSystemBankInfoPermission?: PermissionInterface
	systemBankInfoList: ISystemBankInfoData[]
	onSetStatus: (
		sysId: number,
		bankCode: string,
		bankName: string,
		status: boolean
	) => void
}

const { Option } = Select

const BankMaintenanceModal = ({
	loading,
	visible,
	onCancel,
	editSystemBankInfoPermission,
	currencyListBySite,
	systemBankInfoList,
	onSetStatus,
}: IBankMaintenanceModalProps) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm()
	const formCurrencyIds = Form.useWatch('currencyIds', filterForm)
	const [modalList, setModalList] = useState<ISystemBankInfoData[]>([])

	useEffect(() => {
		if (!loading && systemBankInfoList.length > 0 && formCurrencyIds) {
			if (formCurrencyIds !== 'all') {
				setModalList(
					systemBankInfoList.filter(
						systemBankInfo => systemBankInfo.currencyId === formCurrencyIds
					)
				)
			} else {
				setModalList(systemBankInfoList)
			}
		}
	}, [loading, formCurrencyIds])

	const columns = [
		{
			title: t('Label_BankName'),
			key: 'bankName',
			dataIndex: 'bankName',
			width: '60%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '40%',
			align: 'center' as 'center',
			render: (record: ISystemBankInfoData) => {
				const { sysId, bankCode, bankName, status } = record
				return (
					<Switch
						disabled={!editSystemBankInfoPermission?.canUse}
						checked={Boolean(status)}
						onClick={value => {
							onSetStatus(sysId, bankCode, bankName, value)
						}}
					/>
				)
			},
		},
	]

	return (
		<Modal
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_BankMaintenance')}</div>
			}
			onCancel={onCancel}
			footer={false}
		>
			<Row align='middle' justify='center'>
				<Col span={12}>
					<Form
						layout='vertical'
						size='middle'
						form={filterForm}
						initialValues={{
							currencyIds: 'all',
						}}
					>
						<Form.Item label={t('Label_Currency')} name='currencyIds'>
							<Select>
								<Option key='all' value='all'>
									{t('Label_All')}
								</Option>
								{currencyListBySite.map(({ currencyId, isoCode }) => (
									<Option key={currencyId} value={currencyId}>
										{isoCode}
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

export default BankMaintenanceModal
