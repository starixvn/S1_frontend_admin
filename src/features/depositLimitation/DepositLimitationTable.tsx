import { Dispatch, FC, SetStateAction } from 'react'
import { PermissionInterface } from 'type'
import {
	Form,
	FormInstance,
	InputNumber,
	Popconfirm,
	Space,
	Switch,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { isNull, isNumber } from 'lodash'
import { numberFormatter } from 'common/utils/format'
import {
	DepositTypeEnum,
	IDepositTableData,
} from 'features/depositLimitation/type'

interface IDepositLimitationProps {
	form: FormInstance
	loading: boolean
	editPermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	tableDataSource: IDepositTableData[]
	onTableRowDelete: (record: IDepositTableData) => void
	onTableRowSave: (record: IDepositTableData) => void
	onUpdateStatus: ({
		record,
		status,
		depositType,
	}: {
		record: IDepositTableData
		status: boolean
		depositType: number
	}) => void
}

const DepositLimitationTable: FC<IDepositLimitationProps> = ({
	form,
	loading,
	editPermission,
	editingKey,
	setEditingKey,
	tableDataSource,
	onTableRowDelete,
	onTableRowSave,
	onUpdateStatus,
}) => {
	const { t } = useTranslation()

	const isEditing = (record: IDepositTableData) =>
		record.vipLevel === editingKey

	const onEdit = (record: IDepositTableData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.vipLevel)
	}

	// 這張 table 因為都用 group 的方式 平常的 editable cell 無法正常運作 , 直接把 editable 元件手刻在 columns render 內
	const columns = [
		{
			title: '',
			children: [
				{
					title: t('Label_Action'),
					key: 'action',
					width: 80,
					align: 'center' as 'center',
					render: (record: any) => {
						const editable = isEditing(record)
						return editable ? (
							<Space size='middle'>
								<Typography.Link onClick={() => onTableRowSave(record)}>
									{t('Label_Save')}
								</Typography.Link>

								<Typography.Link onClick={() => setEditingKey(undefined)}>
									{t('Label_Cancel')}
								</Typography.Link>
							</Space>
						) : (
							<Space size='middle'>
								<Typography.Link
									disabled={!editPermission?.canUse || editingKey !== undefined}
									onClick={() => onEdit(record)}
								>
									{t('Label_Edit')}
								</Typography.Link>
								<Popconfirm
									disabled={!editPermission?.canUse}
									title={t('Label_SureToDelete')}
									onConfirm={() => onTableRowDelete(record)}
								>
									<Typography.Link disabled={!editPermission?.canUse}>
										{t('Label_Delete')}
									</Typography.Link>
								</Popconfirm>
							</Space>
						)
					},
				},
			],
		},
		{
			title: '',
			children: [
				{
					title: t('Label_PointLevel'),
					dataIndex: 'vipLevel',
					width: 80,
					align: 'center' as 'center',
					render: (vipLevel: number) => (
						<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
							{`${t('Label_PointLevel')}  ${vipLevel}`}
						</Typography.Text>
					),
				},
			],
		},
		{
			title: t('Label_OnlineBanking'),
			children: [
				{
					title: t('Label_Status'),
					key: 'onlineBankingStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { onlineBankingStatus, onlineBankingMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='onlineBankingStatus'
										style={{ margin: 0 }}
										valuePropName='checked'
									>
										<Switch disabled={!editable} />
									</Form.Item>
								) : (
									<Popconfirm
										disabled={
											!editPermission?.canUse ||
											isNull(onlineBankingMax) ||
											isNull(onlineBankingStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !onlineBankingStatus,
												depositType: DepositTypeEnum.OnlineBanking,
											})
										}
									>
										<Switch
											checked={Boolean(onlineBankingStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(onlineBankingMax) ||
												isNull(onlineBankingStatus)
											}
										/>
									</Popconfirm>
								)}
							</Space>
						)
					},
				},
				{
					title: t('Label_Min'),
					width: 100,
					align: 'center' as 'center',
					key: 'onlineBankingMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { onlineBankingMin } = record
						const editable = isEditing(record)
						if (editable) {
							return (
								<Form.Item
									name='onlineBankingMin'
									style={{ margin: 0 }}
									rules={[
										{
											required: true,
											message: '',
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										controls={false}
										type='number'
									/>
								</Form.Item>
							)
						}
						return isNumber(onlineBankingMin)
							? numberFormatter.format(onlineBankingMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'onlineBankingMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { onlineBankingMax } = record
						const editable = isEditing(record)
						if (editable) {
							return (
								<Form.Item
									name='onlineBankingMax'
									style={{ margin: 0 }}
									rules={[
										{
											required: true,
											message: '',
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										controls={false}
										type='number'
									/>
								</Form.Item>
							)
						}
						return isNumber(onlineBankingMax)
							? numberFormatter.format(onlineBankingMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_MobilePay'),
			children: [
				{
					title: t('Label_Status'),
					key: 'mobilePayStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { mobilePayStatus, mobilePayMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='mobilePayStatus'
										style={{ margin: 0 }}
										valuePropName='checked'
									>
										<Switch disabled={!editable} />
									</Form.Item>
								) : (
									<Popconfirm
										disabled={
											!editPermission?.canUse ||
											isNull(mobilePayMax) ||
											isNull(mobilePayStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !mobilePayStatus,
												depositType: DepositTypeEnum.MobilePay,
											})
										}
									>
										<Switch
											checked={Boolean(mobilePayStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(mobilePayMax) ||
												isNull(mobilePayStatus)
											}
										/>
									</Popconfirm>
								)}
							</Space>
						)
					},
				},
				{
					title: t('Label_Min'),
					width: 100,
					align: 'center' as 'center',
					key: 'mobilePayMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { mobilePayMin } = record
						const editable = isEditing(record)
						if (editable) {
							return (
								<Form.Item
									name='mobilePayMin'
									style={{ margin: 0 }}
									rules={[
										{
											required: true,
											message: '',
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										controls={false}
										type='number'
									/>
								</Form.Item>
							)
						}
						return isNumber(mobilePayMin)
							? numberFormatter.format(mobilePayMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'mobilePayMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { mobilePayMax } = record
						const editable = isEditing(record)
						if (editable) {
							return (
								<Form.Item
									name='mobilePayMax'
									style={{ margin: 0 }}
									rules={[
										{
											required: true,
											message: '',
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										controls={false}
										type='number'
									/>
								</Form.Item>
							)
						}
						return isNumber(mobilePayMax)
							? numberFormatter.format(mobilePayMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_LocalBanking'),
			children: [
				{
					title: t('Label_Status'),
					key: 'localBankingStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { localBankingStatus, localBankingMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='localBankingStatus'
										style={{ margin: 0 }}
										valuePropName='checked'
									>
										<Switch disabled={!editable} />
									</Form.Item>
								) : (
									<Popconfirm
										// 沒有設定過 Max 或 Min 的不給改 status
										disabled={
											!editPermission?.canUse ||
											isNull(localBankingMax) ||
											isNull(localBankingStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !localBankingStatus,
												depositType: DepositTypeEnum.LocalBanking,
											})
										}
									>
										<Switch
											checked={Boolean(localBankingStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(localBankingMax) ||
												isNull(localBankingStatus)
											}
										/>
									</Popconfirm>
								)}
							</Space>
						)
					},
				},
				{
					title: t('Label_Min'),
					width: 100,
					align: 'center' as 'center',
					key: 'localBankingMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { localBankingMin } = record
						const editable = isEditing(record)
						if (editable) {
							return (
								<Form.Item
									name='localBankingMin'
									style={{ margin: 0 }}
									rules={[
										{
											required: true,
											message: '',
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										controls={false}
										type='number'
									/>
								</Form.Item>
							)
						}
						return isNumber(localBankingMin)
							? numberFormatter.format(localBankingMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'localBankingMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { localBankingMax } = record
						const editable = isEditing(record)
						if (editable) {
							return (
								<Form.Item
									name='localBankingMax'
									style={{ margin: 0 }}
									rules={[
										{
											required: true,
											message: '',
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										controls={false}
										type='number'
									/>
								</Form.Item>
							)
						}
						return isNumber(localBankingMax)
							? numberFormatter.format(localBankingMax)
							: 'N/A'
					},
				},
			],
		},
	]

	return (
		<LayoutContent.Card style={{ marginTop: 0 }}>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					pagination={false}
					size='middle'
					columns={columns}
					dataSource={tableDataSource}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { DepositLimitationTable }
