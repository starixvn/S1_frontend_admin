import { Dispatch, FC, SetStateAction } from 'react'
import { DepositTypeEnum, PermissionInterface } from 'type'
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
import { IDepositTableData } from 'features/depositLimitation/type'

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
						const isRequired = isNumber(onlineBankingMin)
						if (editable) {
							return (
								<Form.Item
									name='onlineBankingMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('onlineBankingMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('onlineBankingMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						const isRequired = isNumber(onlineBankingMax)
						if (editable) {
							return (
								<Form.Item
									name='onlineBankingMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('onlineBankingMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('onlineBankingMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						const isRequired = isNumber(mobilePayMin)
						if (editable) {
							return (
								<Form.Item
									name='mobilePayMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('mobilePayMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('mobilePayMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						const isRequired = isNumber(mobilePayMax)
						if (editable) {
							return (
								<Form.Item
									name='mobilePayMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('mobilePayMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('mobilePayMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						const isRequired = isNumber(localBankingMin)
						if (editable) {
							return (
								<Form.Item
									name='localBankingMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('localBankingMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('localBankingMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						const isRequired = isNumber(localBankingMax)
						if (editable) {
							return (
								<Form.Item
									name='localBankingMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('localBankingMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('localBankingMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
		{
			title: t('Label_QuickTransfer'),
			children: [
				{
					title: t('Label_Status'),
					key: 'quickTransferStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { quickTransferStatus, quickTransferMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='quickTransferStatus'
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
											isNull(quickTransferMax) ||
											isNull(quickTransferStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !quickTransferStatus,
												depositType: DepositTypeEnum.QuickTransfer,
											})
										}
									>
										<Switch
											checked={Boolean(quickTransferStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(quickTransferMax) ||
												isNull(quickTransferStatus)
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
					key: 'quickTransferMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { quickTransferMin } = record
						const editable = isEditing(record)
						const isRequired = isNumber(quickTransferMin)
						if (editable) {
							return (
								<Form.Item
									name='quickTransferMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('quickTransferMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('quickTransferMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(quickTransferMin)
							? numberFormatter.format(quickTransferMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'quickTransferMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { quickTransferMax } = record
						const editable = isEditing(record)
						const isRequired = isNumber(quickTransferMax)
						if (editable) {
							return (
								<Form.Item
									name='quickTransferMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('quickTransferMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('quickTransferMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(quickTransferMax)
							? numberFormatter.format(quickTransferMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_CryptoPay'),
			children: [
				{
					title: t('Label_Status'),
					key: 'cryptoPayStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { cryptoPayStatus, cryptoPayMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='cryptoPayStatus'
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
											isNull(cryptoPayMax) ||
											isNull(cryptoPayStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !cryptoPayStatus,
												depositType: DepositTypeEnum.CryptoPay,
											})
										}
									>
										<Switch
											checked={Boolean(cryptoPayStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(cryptoPayMax) ||
												isNull(cryptoPayStatus)
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
					key: 'cryptoPayMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { cryptoPayMin } = record
						const editable = isEditing(record)
						const isRequired = isNumber(cryptoPayMin)
						if (editable) {
							return (
								<Form.Item
									name='cryptoPayMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('cryptoPayMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('cryptoPayMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(cryptoPayMin)
							? numberFormatter.format(cryptoPayMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'cryptoPayMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { cryptoPayMax } = record
						const editable = isEditing(record)
						const isRequired = isNumber(cryptoPayMax)
						if (editable) {
							return (
								<Form.Item
									name='cryptoPayMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('cryptoPayMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('cryptoPayMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(cryptoPayMax)
							? numberFormatter.format(cryptoPayMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_LoadCard'),
			children: [
				{
					title: t('Label_Status'),
					key: 'loadCardStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { loadCardStatus, loadCardMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='loadCardStatus'
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
											isNull(loadCardMax) ||
											isNull(loadCardStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !loadCardStatus,
												depositType: DepositTypeEnum.LoadCard,
											})
										}
									>
										<Switch
											checked={Boolean(loadCardStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(loadCardMax) ||
												isNull(loadCardStatus)
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
					key: 'loadCardMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { loadCardMin } = record
						const editable = isEditing(record)
						const isRequired = isNumber(loadCardMin)
						if (editable) {
							return (
								<Form.Item
									name='loadCardMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('loadCardMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('loadCardMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(loadCardMin)
							? numberFormatter.format(loadCardMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'loadCardMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { loadCardMax } = record
						const editable = isEditing(record)
						const isRequired = isNumber(loadCardMax)
						if (editable) {
							return (
								<Form.Item
									name='loadCardMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('loadCardMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('loadCardMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(loadCardMax)
							? numberFormatter.format(loadCardMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_Auto_Deposit'),
			children: [
				{
					title: t('Label_Status'),
					key: 'bankAutoChannelStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { bankAutoChannelStatus, bankAutoChannelMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='bankAutoChannelStatus'
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
											isNull(bankAutoChannelMax) ||
											isNull(bankAutoChannelStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !bankAutoChannelStatus,
												depositType: DepositTypeEnum.BankAutoChannel,
											})
										}
									>
										<Switch
											checked={Boolean(bankAutoChannelStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(bankAutoChannelMax) ||
												isNull(bankAutoChannelStatus)
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
					key: 'bankAutoChannelMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { bankAutoChannelMin } = record
						const editable = isEditing(record)
						const isRequired = isNumber(bankAutoChannelMin)
						if (editable) {
							return (
								<Form.Item
									name='bankAutoChannelMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('bankAutoChannelMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('bankAutoChannelMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(bankAutoChannelMin)
							? numberFormatter.format(bankAutoChannelMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'bankAutoChannelMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { bankAutoChannelMax } = record
						const editable = isEditing(record)
						const isRequired = isNumber(bankAutoChannelMax)
						if (editable) {
							return (
								<Form.Item
									name='bankAutoChannelMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('bankAutoChannelMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('bankAutoChannelMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(bankAutoChannelMax)
							? numberFormatter.format(bankAutoChannelMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_CryptoWallet'),
			children: [
				{
					title: t('Label_Status'),
					key: 'cryptoWalletStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { cryptoWalletStatus, cryptoWalletMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='cryptoWalletStatus'
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
											isNull(cryptoWalletMax) ||
											isNull(cryptoWalletStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !cryptoWalletStatus,
												depositType: DepositTypeEnum.CryptoWallet,
											})
										}
									>
										<Switch
											checked={Boolean(cryptoWalletStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(cryptoWalletMax) ||
												isNull(cryptoWalletStatus)
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
					key: 'cryptoWalletMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { cryptoWalletMin } = record
						const editable = isEditing(record)
						const isRequired = isNumber(cryptoWalletMin)
						if (editable) {
							return (
								<Form.Item
									name='cryptoWalletMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('cryptoWalletMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('cryptoWalletMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(cryptoWalletMin)
							? numberFormatter.format(cryptoWalletMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'cryptoWalletMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { cryptoWalletMax } = record
						const editable = isEditing(record)
						const isRequired = isNumber(cryptoWalletMax)
						if (editable) {
							return (
								<Form.Item
									name='cryptoWalletMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('cryptoWalletMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('cryptoWalletMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(cryptoWalletMax)
							? numberFormatter.format(cryptoWalletMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_ChatTransfer'),
			children: [
				{
					title: t('Label_Status'),
					key: 'chatTransferStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { chatTransferStatus, chatTransferMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='chatTransferStatus'
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
											isNull(chatTransferMax) ||
											isNull(chatTransferStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !chatTransferStatus,
												depositType: DepositTypeEnum.ChatTransfer,
											})
										}
									>
										<Switch
											checked={Boolean(chatTransferStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(chatTransferMax) ||
												isNull(chatTransferStatus)
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
					key: 'chatTransferMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { chatTransferMin } = record
						const editable = isEditing(record)
						const isRequired = isNumber(chatTransferMin)
						if (editable) {
							return (
								<Form.Item
									name='chatTransferMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('chatTransferMax'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('chatTransferMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(chatTransferMin)
							? numberFormatter.format(chatTransferMin)
							: 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'chatTransferMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { chatTransferMax } = record
						const editable = isEditing(record)
						const isRequired = isNumber(chatTransferMax)
						if (editable) {
							return (
								<Form.Item
									name='chatTransferMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (
													!isRequired &&
													!isNumber(getFieldValue('chatTransferMin'))
												)
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('chatTransferMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(chatTransferMax)
							? numberFormatter.format(chatTransferMax)
							: 'N/A'
					},
				},
			],
		},
		{
			title: t('Label_Qr_Pay'),
			children: [
				{
					title: t('Label_Status'),
					key: 'qrPayStatus',
					width: 80,
					align: 'center' as 'center',
					render: (record: IDepositTableData) => {
						const { qrPayStatus, qrPayMax } = record
						const editable = isEditing(record)
						return (
							<Space align='center'>
								{editable ? (
									<Form.Item
										name='qrPayStatus'
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
											isNull(qrPayMax) ||
											isNull(qrPayStatus)
										}
										title={t('Label_AreYouSure')}
										onConfirm={() =>
											onUpdateStatus({
												record,
												status: !qrPayStatus,
												depositType: DepositTypeEnum.QRPay,
											})
										}
									>
										<Switch
											checked={Boolean(qrPayStatus)}
											disabled={
												!editPermission?.canUse ||
												isNull(qrPayMax) ||
												isNull(qrPayStatus)
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
					key: 'qrPayMin',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { qrPayMin } = record
						const editable = isEditing(record)
						const isRequired = isNumber(qrPayMin)
						if (editable) {
							return (
								<Form.Item
									name='qrPayMin'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (!isRequired && !isNumber(getFieldValue('qrPayMax')))
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('qrPayMax'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(qrPayMin) ? numberFormatter.format(qrPayMin) : 'N/A'
					},
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'qrPayMax',
					innerWidth: 200,
					render: (record: IDepositTableData) => {
						const { qrPayMax } = record
						const editable = isEditing(record)
						const isRequired = isNumber(qrPayMax)
						if (editable) {
							return (
								<Form.Item
									name='qrPayMax'
									style={{ margin: 0 }}
									rules={[
										({ getFieldValue }) => ({
											validator(_, value) {
												if (isRequired && isNumber(value)) {
													return Promise.resolve()
												}
												if (!isRequired && !isNumber(getFieldValue('qrPayMin')))
													return Promise.resolve()
												if (
													isNumber(value) &&
													isNumber(getFieldValue('qrPayMin'))
												)
													return Promise.resolve()

												return Promise.reject(new Error(''))
											},
										}),
										{
											type: 'number',
											min: 0,
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
						return isNumber(qrPayMax) ? numberFormatter.format(qrPayMax) : 'N/A'
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
					scroll={{ x: 'max-content' }}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { DepositLimitationTable }
