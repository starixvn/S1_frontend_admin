import { filter, groupBy, values, uniq, flatten } from 'lodash'
import { Col, Row, Form, Spin, Modal, Select, FormInstance } from 'antd'
import { useTranslation } from 'react-i18next'
import { InputNumber } from 'components'
import { MultipleSelect } from 'components/Select'
import { useAppSelector } from 'app/store'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import { useGetVipLevelQuery } from 'common/service/allDataApi'
import { useGetAllTagQuery } from 'features/memberAdministrationList/api'
import { IAutoVerifyRuleData } from 'features/paymentManagement/type'
import { useGetWithdrawalTypeListQuery } from 'features/paymentManagement/api'

interface IAddAutoWithdrawalRuleModalProps {
	form: FormInstance
	dataFetchingLoading: boolean
	visible: boolean
	autoWithdrawalRuleList: IAutoVerifyRuleData[]
	onCancel: () => void
	onSubmit: () => void
}

const { Option } = Select

const AddAutoWithdrawalRuleModal = ({
	form,
	visible,
	dataFetchingLoading,
	autoWithdrawalRuleList,
	onCancel,
	onSubmit,
}: IAddAutoWithdrawalRuleModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const formCurrencyId = Form.useWatch('currencyId', form)

	const {
		data: { data: typeList = [] } = {},
		isLoading: isGetTypeListLoading,
	} = useGetWithdrawalTypeListQuery(null)

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
		// * 分類出相同 currencyId
		const groupByCurrencyIdList = values(
			groupBy(autoWithdrawalRuleList, 'currencyId')
		)
		// * 找出在相同 currencyId 下已滿的 Withdrawal Type
		const filledWithdrawalTypeList = groupByCurrencyIdList.filter(
			item => item.length === typeList.length
		)
		// * 列出 已滿的 Withdrawal Type 的 currencyId List (篩掉重複)
		const existedCurrencyIdList = values(
			flatten(
				filledWithdrawalTypeList.map(item =>
					uniq(item.map(items => items.currencyId))
				)
			)
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
							({ currencyId }) => !existedCurrencyIdList.includes(currencyId)
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

	const withdrawalTypeSelector = () => {
		const existedAutoWithdrawalRuleList: IAutoVerifyRuleData[] = filter(
			autoWithdrawalRuleList,
			{
				currencyId: formCurrencyId,
			}
		)

		const filteredTypeList = typeList.filter(
			({ value }) =>
				!existedAutoWithdrawalRuleList
					.map(({ withdrawalType: withdrawalTypeId }) => withdrawalTypeId)
					.includes(value)
		)
		return (
			<Form.Item
				name='withdrawalType'
				style={{ margin: '0', width: '100%' }}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_WithdrawalType'),
						}),
					},
				]}
				label={t('Label_WithdrawalType')}
			>
				<Select placeholder={t('Label_Select')} allowClear>
					{filteredTypeList.map(tag => (
						<Option key={tag.value} value={tag.value}>
							{tag.name}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	const loading =
		dataFetchingLoading ||
		isGetTypeListLoading ||
		isGetVipLevelListLoading ||
		isGetAllTagListLoading

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
						<Col span={24}>{withdrawalTypeSelector()}</Col>
					</Row>
				</Form>
			</Spin>
		</Modal>
	)
}

export { AddAutoWithdrawalRuleModal }
