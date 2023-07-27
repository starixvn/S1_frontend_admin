import { Col, Row, Form, Spin, Modal, Select, FormInstance } from 'antd'
import { useTranslation } from 'react-i18next'
import { InputNumber } from 'components'
import { useAppSelector } from 'app/store'
import { SiteIds } from 'app/constants/siteIds'
import { MultipleSelect } from 'components/Select'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import { useGetVipLevelQuery } from 'common/service/allDataApi'
import { DEVICE_LEVEL } from 'features/paymentManagement/constants'
import { useGetAllTagQuery } from 'features/memberAdministrationList/api'
import { IAutoVerifyRuleData } from 'features/paymentManagement/type'

interface IAddAutoVerifyRuleModalProps {
	form: FormInstance
	visible: boolean
	autoVerifyRuleList: IAutoVerifyRuleData[]
	dataFetchingLoading: boolean
	onCancel: () => void
	onSubmit: () => void
}

const { Option } = Select

const AddAutoVerifyRuleModal = ({
	form,
	visible,
	autoVerifyRuleList,
	dataFetchingLoading,
	onCancel,
	onSubmit,
}: IAddAutoVerifyRuleModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const {
		data: { data: vipLevelList = [] } = {},
		isLoading: isGetVipLevelListLoading,
	} = useGetVipLevelQuery({ siteIdForFilter: siteId })

	const {
		data: { data: allTagList = [] } = {},
		isLoading: isGetAllTagListLoading,
	} = useGetAllTagQuery()

	const onClosed = () => {
		form.resetFields()
	}

	const currencySelector = () => {
		const existedCurrencyId = autoVerifyRuleList.map(
			({ currencyId }) => currencyId
		)

		const handleChangeCurrency = (newCurrencyId: number[]) => {
			form.setFieldsValue({ currencyId: newCurrencyId })
		}

		return (
			<Form.Item
				name='currencyId'
				label={t('Label_Currency')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Currency'),
						}),
					},
				]}
			>
				<Select
					placeholder={t('Label_Select') + t('Label_Currency')}
					onChange={handleChangeCurrency}
				>
					{currencyListBySite
						?.filter(
							({ currencyId }) => !existedCurrencyId.includes(currencyId)
						)
						?.map(({ currencyId, isoCode }) => (
							<Option key={currencyId} value={currencyId}>
								{isoCode}
							</Option>
						))}
				</Select>
			</Form.Item>
		)
	}

	const vipLevelSelector = () => {
		const handleChangeVipLevel = (newLevels: number[]) => {
			if (newLevels.includes(0)) {
				form.setFieldsValue({
					vipLevels: vipLevelList.map(({ level }) => level),
				})
			} else {
				form.setFieldsValue({
					vipLevels: newLevels,
				})
			}
		}

		return (
			<Form.Item
				name='vipLevels'
				label={t('Label_VipLevel')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_VipLevel'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={handleChangeVipLevel}
					placeholder={t('Label_Select')}
				>
					{vipLevelList.length > 1 && (
						<Option value={0}>{t('Label_All')}</Option>
					)}
					{vipLevelList.map(vipLevel => (
						<Option key={vipLevel.level} value={vipLevel.level}>
							{vipLevel.levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const tagsSelector = () => {
		const handleChangeTag = (newTags: number[]) => {
			if (newTags.includes(0)) {
				form.setFieldsValue({
					tags: allTagList.map(({ id }) => id),
				})
			} else {
				form.setFieldsValue({
					tags: newTags,
				})
			}
		}

		return (
			<Form.Item
				name='tags'
				label={t('Label_Tags')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Tags'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={handleChangeTag}
					placeholder={t('Label_Select')}
				>
					{allTagList.length > 1 && <Option value={0}>{t('Label_All')}</Option>}
					{allTagList.map(tag => (
						<Option key={tag.id} value={tag.id}>
							{tag.tagName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const deviceLevelSelector = () => {
		const handleChangeLevel = (newLevels: string[]) => {
			if (newLevels.includes('All')) {
				form.setFieldsValue({
					deviceLevel: DEVICE_LEVEL.map(level => level),
				})
			} else {
				form.setFieldsValue({ deviceLevel: newLevels })
			}
		}

		return (
			<Form.Item
				name='deviceLevel'
				label={t('Label_DeviceLevel')}
				style={{ margin: '0', width: '100%' }}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_DeviceLevel'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={handleChangeLevel}
					placeholder={t('Label_Select')}
				>
					{DEVICE_LEVEL.length > 1 && (
						<Option value='All'>{t('Label_All')}</Option>
					)}
					{DEVICE_LEVEL.map(level => (
						<Option key={level} value={level}>
							{level}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const loading =
		dataFetchingLoading || isGetVipLevelListLoading || isGetAllTagListLoading

	return (
		<Modal
			open={visible}
			confirmLoading={loading}
			onOk={onSubmit}
			onCancel={onCancel}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			afterClose={onClosed}
		>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' size='middle'>
					<Row gutter={16}>
						<Col span={12}>{currencySelector()}</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='withdrawalAmount'
								label={`${t('Label_WithdrawalAmount')} (<=)`}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_WithdrawalAmount'),
										}),
									},
								]}
							>
								<InputNumber min={0} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='accountWithdrawalCount'
								label={`${t('Label_AccountWithdrawalCount')} (>=)`}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AccountWithdrawalCount'),
										}),
									},
								]}
							>
								<InputNumber min={0} />
							</Form.Item>
						</Col>
						<Col span={24}>{vipLevelSelector()}</Col>
						<Col span={24}>{tagsSelector()}</Col>
						{siteId === SiteIds.Nova88 ? (
							<Col span={24}>{deviceLevelSelector()}</Col>
						) : (
							<Col span={24}>
								<Form.Item
									name='deviceScores'
									label={`${t('Label_DeviceScores')} (>=)`}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_DeviceScores'),
											}),
										},
									]}
								>
									<InputNumber
										min={0}
										placeholder={t('Label_DeviceScoresHint')}
									/>
								</Form.Item>
							</Col>
						)}
					</Row>
				</Form>
			</Spin>
		</Modal>
	)
}

export { AddAutoVerifyRuleModal }
