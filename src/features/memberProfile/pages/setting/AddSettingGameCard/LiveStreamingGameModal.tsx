import { useState } from 'react'
import { filter, find } from 'lodash'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import {
	useGetTpListQuery,
	useGetProductsQuery,
} from 'common/service/allDataApi'
import { Form, FormInstance, Row, Col, Modal, Select } from 'antd'
import {
	IAddLiveStreamingGameForm,
	IAddLiveStreamingGameTableData,
} from 'features/memberProfile/type'
import LiveStreamingGameResultTable from 'features/memberProfile/pages/setting/AddSettingGameCard/LiveStreamingGameResultTable'

interface ILiveStreamingGameModalProps {
	loading: boolean
	form: FormInstance<IAddLiveStreamingGameForm>
	visible: boolean
	onCancel: () => void
	onFinish: () => void
}

const { Option } = Select

const LiveStreamingGameModal = ({
	loading,
	form,
	visible,
	onCancel,
	onFinish,
}: ILiveStreamingGameModalProps) => {
	const { t } = useTranslation()
	const [filterResult, setFilterResult] = useState<
		IAddLiveStreamingGameTableData[]
	>([])

	const { data: { data: tpList = [] } = {} } = useGetTpListQuery(null)

	const { data: { data: gameTypeList = [] } = {} } = useGetProductsQuery(null)

	const handleVender = (newTpId: number) => {
		if (gameTypeList.length > 0) {
			// 每次選 Vender 時先清空之前 GameType 所選的值和 ResultTable 的值
			form.resetFields(['tpGameTypes'])
			setFilterResult([])
			// 找到所選的 Vender
			const tpListItem = find(tpList, ['id', newTpId])
			// 用 gameTypeList 下去 filter 並塞入 Vender 欄位顯示的名稱 => 用於 ResultTable 顯示
			const tpIdTableResult = filter(gameTypeList, ['tpId', newTpId]).map(
				({ ...rest }) => {
					return { ...rest, tpName: tpListItem?.tpDisplayName! }
				}
			)
			setFilterResult(tpIdTableResult)
		}
	}

	return (
		<Modal
			confirmLoading={loading}
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_LiveStreamingGame')}
				</div>
			}
			open={visible}
			onCancel={onCancel}
			afterClose={() => {
				form.resetFields()
			}}
			onOk={onFinish}
		>
			<Form form={form} layout='vertical' wrapperCol={{ span: 24 }}>
				<Row align='middle' gutter={[16, 16]}>
					<Col span={12}>
						<Form.Item
							name='tpId'
							label={t('Label_Vender')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Vender'),
									}),
								},
							]}
						>
							<Select
								onChange={handleVender}
								placeholder={`${t('Label_Select')} ${t('Label_Vender')}`}
							>
								{tpList?.map(({ id, tpDisplayName }) => (
									<Option key={id} value={id}>
										{tpDisplayName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					{filterResult.length > 0 && (
						<Col span={12}>
							<Form.Item
								name='tpGameTypes'
								label={t('Label_GameType')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_TpGameType'),
										}),
									},
								]}
							>
								<MultipleSelect
									placeholder={`${t('Label_Search')} ${t('Label_GameType')}`}
									showSearch
									allowClear
									filterOption={(input, option) => {
										const isIncludes: boolean = (
											option!.children as unknown as string
										)
											.toLowerCase()
											.includes(input.toLowerCase())

										return isIncludes
									}}
								>
									{filterResult?.map(({ typeName, type }) => (
										<Option key={type} value={type}>
											{typeName}
										</Option>
									))}
								</MultipleSelect>
							</Form.Item>
						</Col>
					)}
				</Row>
			</Form>

			<LiveStreamingGameResultTable form={form} filterResult={filterResult} />
		</Modal>
	)
}

export default LiveStreamingGameModal
