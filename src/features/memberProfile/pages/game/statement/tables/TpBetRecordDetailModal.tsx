import { IGetTpBetRecordDetailData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Descriptions, Modal, Spin, Tabs, Typography } from 'antd'
import ReactJson from 'react-json-view'
import { isJSON } from 'common/utils'

interface ITpBetRecordDetailModalProps {
	loading: boolean
	tpBetRecordDetail: IGetTpBetRecordDetailData
	visible: boolean
	onCancel: () => void
}

const { Item } = Descriptions

const TpBetRecordDetailModal = ({
	loading,
	tpBetRecordDetail,
	visible,
	onCancel,
}: ITpBetRecordDetailModalProps) => {
	const { t } = useTranslation()
	const {
		detailUrl,
		tpId,
		tpCategoryId,
		gameType,
		gameTypeName,
		transId,
		tpCurrency,
		refTransId,
		tpUserName,
		utcBetTime,
		utcSettledTime,
		stake,
		winlostAmount,
		detail,
	} = tpBetRecordDetail ?? {}

	const { tpCurrencyId, exchangeRate } = tpCurrency ?? {}

	const items = () => {
		const rawItems = [
			{
				label: t('Label_MainDetail'),
				key: 'mainDetail',
				children: (
					<Spin spinning={loading}>
						<Descriptions layout='horizontal' bordered size='small' column={2}>
							{/* 有兩種顯示方式，判斷有無 detailUrl 來切換顯示內容 */}
							{detailUrl !== null ? (
								<>
									<Item label={t('Label_Detail')} span={2}>
										<Typography.Link href={detailUrl} target='_blank'>
											{t('Label_ClickToShowDetail')}
										</Typography.Link>
									</Item>
									<Item label={t('Label_TransId')} span={2}>
										{transId}
									</Item>
									<Item label={t('Label_TpID')}>{tpId}</Item>
									<Item label={t('Label_TpCategoryId')}>{tpCategoryId}</Item>
									<Item label={t('Label_GameType')}>{gameType}</Item>
									<Item label={t('Label_GameTypeName')}>{gameTypeName}</Item>
									<Item label={t('Label_TpCurrency')} span={1}>
										{tpCurrencyId}
									</Item>
									<Item label={t('Label_ExchangeRate')} span={1}>
										{exchangeRate}
									</Item>
								</>
							) : (
								<>
									<Item label={t('Label_RefTransId')}>{refTransId}</Item>
									<Item label={t('Label_TpUserName')}>{tpUserName}</Item>
									<Item label={t('Label_UtcBetTime')} span={2}>
										{utcBetTime}
									</Item>
									<Item label={t('Label_UtcSettledTime')} span={2}>
										{utcSettledTime}
									</Item>
									<Item label={t('Label_Stake')}>{stake}</Item>
									<Item label={t('Label_WinLoss')}>{winlostAmount}</Item>
									<Item label={t('Label_TpID')}>{tpId}</Item>
									<Item label={t('Label_TpCategoryId')}>{tpCategoryId}</Item>
									<Item label={t('Label_GameType')}>{gameType}</Item>
									<Item label={t('Label_GameTypeName')}>{gameTypeName}</Item>
									<Item label={t('Label_TpCurrency')}>{tpCurrencyId}</Item>
									<Item label={t('Label_ExchangeRate')}>{exchangeRate}</Item>
								</>
							)}
						</Descriptions>
					</Spin>
				),
			},
		]
		// 有 detail 才新增該 tab
		if (isJSON(detail)) {
			rawItems.push({
				label: t('Label_RawDetail'),
				key: 'rawDetail',
				children: (
					<ReactJson
						style={{ wordBreak: 'break-word' }}
						src={JSON.parse(detail)}
						displayDataTypes={false}
					/>
				),
			})
		}
		return rawItems
	}
	return (
		<Modal open={visible} footer={false} onCancel={onCancel} width='50vw'>
			<Tabs items={items()} defaultActiveKey='1' type='card' />
		</Modal>
	)
}

export { TpBetRecordDetailModal }
