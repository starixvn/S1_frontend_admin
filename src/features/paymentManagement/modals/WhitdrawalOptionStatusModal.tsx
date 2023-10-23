import { find } from 'lodash'
import { Table } from 'components'
import { useEffect, useState } from 'react'
import { PermissionInterface } from 'type'
import { Currency } from 'common/enum/type'
import { useTranslation } from 'react-i18next'
import { Col, Form, Modal, Row, Select, Switch } from 'antd'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { IWithdrawalBlockSwitchData } from 'features/paymentManagement/type'

interface IWithdrawalOptionStatusModal {
	loading: boolean
	visible: boolean
	onCancel: () => void
	currencyListBySite: Currency[]
	editPermission?: PermissionInterface
	withdrawalBlockSwitchList: IWithdrawalBlockSwitchData[]
	onSetStatus: (currencyId: number, type: number, status: boolean) => void
}

const { Option } = Select

const WithdrawalOptionStatusModal = ({
	loading,
	visible,
	onCancel,
	editPermission,
	currencyListBySite,
	withdrawalBlockSwitchList,
	onSetStatus,
}: IWithdrawalOptionStatusModal) => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm()
	const formCurrencyIds = Form.useWatch('currencyIds', filterForm)
	const [modalList, setModalList] = useState<IWithdrawalBlockSwitchData[]>([])

	const { data: { data: withdrawalBlockList = [] } = {} } = useGetEnumTypeQuery(
		{
			enumName: 'WithdrawalBlockTypeEnum',
		}
	)

	useEffect(() => {
		if (!loading && withdrawalBlockSwitchList.length > 0 && formCurrencyIds) {
			if (formCurrencyIds !== 'all') {
				setModalList(
					withdrawalBlockSwitchList.filter(
						withdrawalBlockSwitch =>
							withdrawalBlockSwitch.currencyId === formCurrencyIds
					)
				)
			} else {
				setModalList(withdrawalBlockSwitchList)
			}
		}
	}, [loading, formCurrencyIds])

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currencyId',
			dataIndex: 'currencyId',
			width: '60%',
			align: 'center' as 'center',
			render: (currencyId: number) => {
				return find(currencyListBySite, { currencyId })?.isoCode || '-'
			},
		},
		{
			title: t('Label_WithdrawalType'),
			key: 'type',
			dataIndex: 'type',
			width: '60%',
			align: 'center' as 'center',
			render: (type: number) => {
				return find(withdrawalBlockList, { value: type })?.name || '-'
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '40%',
			align: 'center' as 'center',
			render: (record: IWithdrawalBlockSwitchData) => {
				const { currencyId, type, status } = record
				return (
					<Switch
						disabled={!editPermission?.canUse}
						checked={Boolean(status)}
						onClick={value => {
							onSetStatus(currencyId, type, value)
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
				<div style={{ textAlign: 'center' }}>
					{t('Label_WithdrawalOptionStatus')}
				</div>
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

export { WithdrawalOptionStatusModal }
