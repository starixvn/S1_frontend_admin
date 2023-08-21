import { useTranslation } from 'react-i18next'
import { Modal, Switch } from 'antd'
import { Table } from 'components'
import {
	IGetBankInfoData,
	PaymentStatusEnum,
} from 'features/paymentManagement/type'
import { useEffect, useState } from 'react'
import { Currency } from 'common/enum/type'
import { find } from 'lodash'

interface IOnlineBankInfoModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	bankInfoList: IGetBankInfoData[]
	onSetStatus: ({
		sysId,
		status,
		method,
	}: {
		sysId: number
		status: boolean
		method: number
	}) => void
	currencyListBySite: Currency[]
}

const OnlineBankInfoModal = ({
	loading,
	visible,
	onCancel,
	bankInfoList,
	currencyListBySite,
	onSetStatus,
}: IOnlineBankInfoModalProps) => {
	const { t } = useTranslation()
	const [modalData, setModalData] = useState<IGetBankInfoData[]>([])

	const columns = [
		{
			title: '#',
			key: 'sort',
			dataIndex: 'id',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetBankInfoData) => {
				const { id: sysId, status, bankName, method } = record
				return (
					<Switch
						// * 修復分頁相同索引職，發現 Antd Table 的 Key 沒辦法對 Switch 起作用，可能是他們的 bug
						key={bankName}
						defaultChecked={status === PaymentStatusEnum.True}
						onClick={value => {
							onSetStatus({ sysId, status: value, method })
						}}
					/>
				)
			},
		},
		{
			title: t('Label_BankCode'),
			key: 'bankCode',
			dataIndex: 'bankCode',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_BankName'),
			key: 'bankName',
			dataIndex: 'bankName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currencyId',
			width: 80,
			align: 'center' as 'center',
			render: (currencyId: number) => {
				return find(
					currencyListBySite,
					currency => currency.currencyId === currencyId
				)?.isoCode
			},
		},
	]

	// 初始化數據
	useEffect(() => {
		if (!loading && bankInfoList?.length > 0) {
			setModalData(bankInfoList)
		}
	}, [loading])

	// 清空數據
	useEffect(() => {
		if (!visible) {
			// 視覺上確保 Modal 關閉後才清除資料
			setTimeout(() => {
				setModalData([])
			}, 500)
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			footer={false}
			title={false}
			destroyOnClose
		>
			<Table
				loading={loading}
				pagination={false}
				scroll={{ y: 400 }}
				dataSource={modalData ?? []}
				columns={columns}
			/>
		</Modal>
	)
}

export { OnlineBankInfoModal }
