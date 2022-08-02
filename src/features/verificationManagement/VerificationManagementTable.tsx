import React, { FC } from 'react'
import { Form, FormInstance, Select, Space, Switch, Typography } from 'antd'
import { Table, EditableCellRows } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { IGetVerificationRewardData } from 'features/verificationManagement/type'
import { verificationTypeList } from 'features/verificationManagement/constants'

const { Option } = Select

interface IVerificationManagementTableProps {
	form: FormInstance
	loading: boolean
	verificationRewardData: IGetVerificationRewardData[]
	editPermission?: PermissionInterface
	onSaved: (before: IGetVerificationRewardData) => void
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
	editingKey: number | undefined
	onSwitchStatus: (currencyId: number, before: number, after: number) => void
}

const VerificationManagementTable: FC<IVerificationManagementTableProps> = ({
	verificationRewardData,
	form,
	loading,
	editPermission,
	onSaved,
	setEditingKey,
	editingKey,
	onSwitchStatus,
}) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetVerificationRewardData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.currencyId)
	}

	const isEditing = (record: IGetVerificationRewardData) =>
		record.currencyId === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetVerificationRewardData) => {
				const editable = isEditing(record)

				return editable ? (
					<Space>
						<Typography.Link
							onClick={() => onSaved(record)}
							style={{ marginRight: 8 }}
						>
							{t('Label_Save')}
						</Typography.Link>
						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DepositAmount'),
			key: 'minDeposit',
			dataIndex: 'minDeposit',
			width: 80,
			align: 'center' as 'center',
			editable: true,
			render: (minDeposit: number) => numberFormatter.format(minDeposit) ?? '',
		},
		{
			title: t('Label_VerificationType'),
			key: 'verificationType',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetVerificationRewardData) => {
				const { verificationType } = record
				const displayKey = verificationTypeList?.find(
					type => type.value === verificationType
				)?.displayKey
				const renderInfo = displayKey ? t(displayKey) : ''
				return isEditing(record) ? (
					<Form.Item name='verificationType' noStyle>
						<Select style={{ width: '80%' }} defaultValue={verificationType}>
							{verificationTypeList?.map(type => (
								<Option key={type.value} value={type.value}>
									{t(type.displayKey)}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					renderInfo
				)
			},
		},
		{
			title: t('Label_PhoneReward'),
			key: 'phoneReward',
			dataIndex: 'phoneReward',
			width: 80,
			align: 'center' as 'center',
			editable: true,
			render: (phoneReward: number) =>
				numberFormatter.format(phoneReward) ?? '',
		},
		{
			title: t('Label_EmailReward'),
			key: 'emailReward',
			dataIndex: 'emailReward',
			width: 80,
			align: 'center' as 'center',
			editable: true,
			render: (emailReward: number) =>
				numberFormatter.format(emailReward) ?? '',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (value: IGetVerificationRewardData) => {
				const { currencyId, status } = value
				const handleSwitchChange = (currentStatus: boolean) =>
					onSwitchStatus(currencyId, status, Number(currentStatus))

				return (
					<Switch
						disabled={!editPermission?.canUse}
						defaultChecked={Boolean(status)}
						onChange={handleSwitchChange}
					/>
				)
			},
		},
	]

	const mergedColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetVerificationRewardData) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	return (
		<LayoutContent.Card
			style={{ paddingTop: '20px', paddingBottom: '20px', marginTop: 0 }}
		>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					loading={loading}
					columns={mergedColumns}
					dataSource={verificationRewardData ?? []}
					pagination={false}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { VerificationManagementTable }
