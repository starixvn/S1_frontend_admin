import { Modal, Spin, Switch, Typography } from 'antd'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { IGetCryptoInfoData } from 'features/paymentManagement/type'
import { useAuth } from '../../../common/hooks'

interface ICryptoSettingModalProps {
	loading: boolean
	visible: boolean
	cryptoInfo: IGetCryptoInfoData[]
	onCancel: () => void
	onSetCryptoInfo: (record: IGetCryptoInfoData, status: number) => void
}

const CryptoSettingModal = ({
	loading,
	visible,
	cryptoInfo,
	onCancel,
	onSetCryptoInfo,
}: ICryptoSettingModalProps) => {
	const { t } = useTranslation()

	const { actionPermissions: { editPermission } = {} } = useAuth()

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			width: '35%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_NetWork'),
			key: 'network',
			dataIndex: 'network',
			width: '35%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '30%',
			align: 'center' as 'center',
			render: (record: IGetCryptoInfoData) => {
				const { status } = record
				return (
					<Switch
						defaultChecked={Boolean(status)}
						onChange={value => {
							onSetCryptoInfo(record, Number(value))
						}}
						disabled={!editPermission?.canUse}
					/>
				)
			},
		},
	]

	return (
		<Modal
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_CryptoSetting')}</div>
			}
			open={visible}
			onCancel={onCancel}
			footer={false}
		>
			<Spin spinning={loading}>
				<Typography.Text>{t('Label_CryptoSettingMSG')}</Typography.Text>
				<Table
					columns={columns}
					dataSource={cryptoInfo}
					pagination={false}
					style={{ marginTop: '10px' }}
				/>
			</Spin>
		</Modal>
	)
}

export { CryptoSettingModal }
