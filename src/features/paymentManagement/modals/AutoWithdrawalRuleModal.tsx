import { useState } from 'react'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
	Col,
	Row,
	Spin,
	Form,
	Modal,
	Space,
	Switch,
	Select,
	Button,
	Typography,
	Popconfirm,
	FormInstance,
} from 'antd'
import { Table, InputNumber } from 'components'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { MultipleSelect } from 'components/Select'
import { numberFormatter } from 'common/utils/format'
import { useGetVipLevelQuery } from 'common/service/allDataApi'
import { useGetAllTagQuery } from 'features/memberAdministrationList/api'
import { IAutoVerifyRuleData } from 'features/paymentManagement/type'
import { useGetWithdrawalTypeListQuery } from 'features/paymentManagement/api'

interface IAutoWithdrawalRuleModalProps {
	form: FormInstance
	visible: boolean
	editPermission?: PermissionInterface
	dataFetchingLoading: boolean
	autoWithdrawalRuleList: IAutoVerifyRuleData[]
	onCancel: () => void
	onAddClick: () => void
	onSetAutoWithdrawalRule: (
		id: number,
		currencyId: number,
		setEditingKey: (type: undefined) => void
	) => void
	onDeleteAutoWithdrawalRule: (id: number) => void
}

const { Option } = Select

const AutoWithdrawalRuleModal = ({
	form,
	visible,
	editPermission,
	dataFetchingLoading,
	autoWithdrawalRuleList,
	onCancel,
	onAddClick,
	onSetAutoWithdrawalRule,
	onDeleteAutoWithdrawalRule,
}: IAutoWithdrawalRuleModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)

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

	const isEditing = (data: IAutoVerifyRuleData) => data.id === editingKey

	const onEdit = (data: IAutoVerifyRuleData) => {
		form.setFieldsValue({ ...data })
		setEditingKey(data.id)
	}

	const vipLevelSelector = () => {
		const handleChangeVipLevel = (newLevels: number[]) => {
			if (newLevels.includes(0)) {
				form.setFieldsValue({
					vipLevels: vipLevelList.map(({ level }) => level),
				})
			} else {
				form.setFieldsValue({ vipLevels: newLevels })
			}
		}

		return (
			<Form.Item
				name='vipLevels'
				style={{ margin: '0', width: '100%' }}
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
				form.setFieldsValue({ tags: newTags })
			}
		}

		return (
			<Form.Item
				name='tags'
				style={{ margin: '0', width: '100%' }}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Tagging'),
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
			>
				<Select placeholder={t('Label_Select')} allowClear>
					{typeList.map(tag => (
						<Option key={tag.value} value={tag.value}>
							{tag.name}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	const onClosed = () => {
		setEditingKey(undefined)
	}

	const columns = [
		{
			title: t('Label_Action'),
			key: 'currencyName',
			align: 'center' as 'center',
			width: '10%',
			render: (data: IAutoVerifyRuleData) => {
				const editable = isEditing(data)
				const { id, currencyId } = data

				return editable ? (
					<Space size='middle'>
						<Typography.Link
							onClick={() =>
								onSetAutoWithdrawalRule(id, currencyId, setEditingKey)
							}
						>
							{t('Label_Save')}
						</Typography.Link>
						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Space size='middle'>
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() => onEdit(data)}
						>
							{t('Label_Edit')}
						</Typography.Link>
						<Popconfirm
							title={t('Label_SureToDelete')}
							disabled={!editPermission?.canUse}
							onConfirm={() => onDeleteAutoWithdrawalRule(id)}
						>
							<Typography.Link disabled={!editPermission?.canUse}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: '10%',
			align: 'center' as 'center',
			render: (isoCode: string) => isoCode ?? 'N/A',
		},
		{
			title: `${t('Label_WithdrawalAmount')} (<=)`,
			key: 'withdrawalAmount',
			width: '10%',
			align: 'center' as 'center',
			render: (data: IAutoVerifyRuleData) => {
				const editable = isEditing(data)
				const { withdrawalAmount } = data

				return editable ? (
					<Form.Item
						name='withdrawalAmount'
						style={{ margin: '0' }}
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
				) : (
					numberFormatter.format(withdrawalAmount)
				)
			},
		},
		{
			title: `${t('Label_AccountWithdrawalCount')} (>=)`,
			key: 'accountWithdrawalCount',
			width: '5%',
			align: 'center' as 'center',
			render: (data: IAutoVerifyRuleData) => {
				const editable = isEditing(data)
				const { accountWithdrawalCount } = data

				return editable ? (
					<Form.Item
						name='accountWithdrawalCount'
						style={{ margin: '0' }}
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
				) : (
					accountWithdrawalCount
				)
			},
		},
		{
			title: t('Label_VipLevel'),
			key: 'vipLevels',
			width: '20%',
			align: 'center' as 'center',
			render: (data: IAutoVerifyRuleData) => {
				const editable = isEditing(data)
				const { vipLevels } = data

				const vipLevelsNameList = vipLevels
					.map(
						(value: number) => find(vipLevelList, { level: value })?.levelName
					)
					.join(', ')

				return editable ? vipLevelSelector() : vipLevelsNameList
			},
		},
		{
			title: t('Label_Tagging'),
			key: 'tags',
			width: '20%',
			align: 'center' as 'center',
			render: (data: IAutoVerifyRuleData) => {
				const editable = isEditing(data)
				const { tags } = data

				const tagDescriptionList = tags
					.map((tag: number) => find(allTagList, { id: tag })?.tagName)
					.join(', ')

				return editable ? tagsSelector() : tagDescriptionList
			},
		},
		{
			title: t('Label_WithdrawalType'),
			key: 'withdrawalType',
			width: '20%',
			align: 'center' as 'center',
			render: (data: IAutoVerifyRuleData) => {
				const editable = isEditing(data)
				const { withdrawalType } = data

				const withdrawalTypeName = find(typeList, {
					value: withdrawalType,
				})?.name

				return editable ? withdrawalTypeSelector() : withdrawalTypeName
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '5%',
			align: 'center' as 'center',
			render: (data: IAutoVerifyRuleData) => {
				const editable = isEditing(data)
				const { status } = data

				return editable ? (
					<Form.Item
						name='status'
						style={{ margin: '0' }}
						valuePropName='checked'
					>
						<Switch />
					</Form.Item>
				) : (
					<Switch checked={!!status} disabled />
				)
			},
		},
	]

	const loading =
		dataFetchingLoading ||
		isGetVipLevelListLoading ||
		isGetAllTagListLoading ||
		isGetTypeListLoading

	return (
		<Modal
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_AutoWithdrawalRule')}
				</div>
			}
			width='80vw'
			open={visible}
			afterClose={onClosed}
			onCancel={onCancel}
			footer={false}
		>
			<Spin spinning={loading}>
				<Form form={form} component={false}>
					<Table
						columns={columns}
						dataSource={autoWithdrawalRuleList}
						pagination={false}
					/>
				</Form>
			</Spin>

			<Row justify='end' style={{ marginTop: '20px' }}>
				<Col>
					<Button
						type='primary'
						onClick={() => {
							onAddClick()
							setEditingKey(undefined)
						}}
						disabled={!!editingKey}
					>
						{t('Label_Add')}
					</Button>
				</Col>
			</Row>
		</Modal>
	)
}

export { AutoWithdrawalRuleModal }
