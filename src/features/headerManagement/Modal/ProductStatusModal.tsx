import { useState } from 'react'
import { head } from 'lodash'
import { Table } from 'components'
import moment from 'moment/moment'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { timeFormat } from 'common/utils/format'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	Tag,
	Col,
	Form,
	message,
	Modal,
	Row,
	Select,
	Space,
	Switch,
	Typography,
	DatePicker,
} from 'antd'
import {
	ICON_STATUS_TAGS,
	IconTypeList,
} from 'features/headerManagement/constatns'
import {
	IHeaderSettingGroupByTpGameIdNoData,
	ILobbyCategoryData,
	IFilterProductStatusModalForm,
	IHeaderSettingEnum,
	IEditProductStatusForm,
} from 'features/headerManagement/type'
import {
	useGetHeaderSettingGroupByTpGameIdNoListQuery,
	useUpdateHeaderSettingByTpGameIdMutation,
} from 'features/headerManagement/api'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'

interface IProductStatusModalProps {
	visible: boolean
	onCancel: () => void
	lobbyCategoryList: ILobbyCategoryData[]
	editPermission?: PermissionInterface
}

const { Option } = Select
const { RangePicker } = DatePicker

const ProductStatusModal = ({
	visible,
	onCancel,
	lobbyCategoryList,
	editPermission,
}: IProductStatusModalProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const [filterModalForm] = Form.useForm<IFilterProductStatusModalForm>()
	const [editForm] = Form.useForm<IEditProductStatusForm>()
	const formLobbyCategoryId = Form.useWatch('lobbyCategoryId', filterModalForm)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)

	const {
		data: { data: headerSettingGroupByTpGameIdNoList = [] } = {},
		isFetching: headerSettingGroupByTpGameIdNoListFetching,
	} = useGetHeaderSettingGroupByTpGameIdNoListQuery(
		{
			siteId,
			lobbyCategoryId: formLobbyCategoryId,
		},
		{ skip: !siteId || !formLobbyCategoryId }
	)

	const [
		updateHeaderSettingByTpGameId,
		{ isLoading: isUpdateHeaderSettingByTpGameIdLoading },
	] = useUpdateHeaderSettingByTpGameIdMutation()

	const handleRowSaved = async (tpGameIdNo: number) => {
		if (!editingKey && !siteId) return
		const { dateRange, status, iconType } = await editForm.validateFields()

		const [iconStartTime, iconEndTime] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)

		try {
			await updateHeaderSettingByTpGameId({
				siteId,
				tpGameIdNo,
				status: status ? IHeaderSettingEnum.True : IHeaderSettingEnum.False,
				iconType,
				iconStartTime,
				iconEndTime,
			})
			message.success(t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const onEdit = ({
		iconStartTime,
		iconEndTime,
		tpGameIdNo,
	}: IHeaderSettingGroupByTpGameIdNoData) => {
		editForm.setFieldsValue({
			dateRange: [moment(iconStartTime), moment(iconEndTime)],
		})
		setEditingKey(tpGameIdNo)
	}

	const isEditing = (record: IHeaderSettingGroupByTpGameIdNoData) =>
		record.tpGameIdNo === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			width: 160,
			key: 'operation',
			align: 'center' as 'center',
			render: (record: IHeaderSettingGroupByTpGameIdNoData) => {
				const editable = isEditing(record)
				const { tpGameIdNo } = record
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={() => handleRowSaved(tpGameIdNo)}>
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
							onClick={() => onEdit(record)}
						>
							{t('Label_Edit')}
						</Typography.Link>
					</Space>
				)
			},
		},
		{
			title: t('Label_Category'),
			key: 'lobbyCategory',
			dataIndex: 'lobbyCategory',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Product'),
			key: 'productName',
			dataIndex: 'productName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (record: IHeaderSettingGroupByTpGameIdNoData) => {
				const { status } = record
				const editable = isEditing(record)

				return editable ? (
					<Form.Item
						name='status'
						style={{ margin: 0 }}
						valuePropName='checked'
					>
						<Switch
							checked={Boolean(status)}
							disabled={!editPermission?.canUse}
						/>
					</Form.Item>
				) : (
					<Switch checked={Boolean(status)} disabled />
				)
			},
		},
		{
			title: t('Label_IconType'),
			key: 'iconType',
			width: 120,
			align: 'center' as 'center',
			render: (record: IHeaderSettingGroupByTpGameIdNoData) => {
				const editable = isEditing(record)
				const { iconType } = record
				const { color, displayName } = ICON_STATUS_TAGS[iconType] || {}

				return editable ? (
					<Form.Item noStyle name='iconType'>
						<Select defaultValue={iconType} placeholder='select'>
							{IconTypeList.map(({ value, name }) => (
								<Option key={value} value={value}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					(displayName && <Tag color={color}>{t(displayName)}</Tag>) || '-'
				)
			},
		},
		{
			title: t('Label_IconStartTime'),
			key: 'iconStartTime',
			align: 'center' as 'center',
			width: 200,
			onCell: (record: IHeaderSettingGroupByTpGameIdNoData) => {
				const editable = isEditing(record)
				return {
					colSpan: editable ? 2 : 1,
				}
			},
			render: (record: IHeaderSettingGroupByTpGameIdNoData) => {
				const { iconStartTime } = record
				const editable = isEditing(record)

				return editable ? (
					<Form.Item
						noStyle
						name='dateRange'
						initialValue={MOMENT_DATE_RANGES.Today}
						rules={[
							{
								required: true,
								message: t('Label_DateRangeRequire'),
							},
						]}
					>
						<RangePicker
							style={{ width: '100%' }}
							ranges={MOMENT_RANGE_PICKER_RANGES([
								'Today',
								'Yesterday',
								'Last Week',
								'This Month',
								'Last Month',
							])}
							showTime
						/>
					</Form.Item>
				) : (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(iconStartTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_IconEndTime'),
			key: 'iconEndTime',
			align: 'center' as 'center',
			width: 200,
			onCell: (record: IHeaderSettingGroupByTpGameIdNoData) => {
				const editable = isEditing(record)
				return {
					colSpan: editable ? 0 : 1,
				}
			},
			render: (record: IHeaderSettingGroupByTpGameIdNoData) => {
				const { iconEndTime } = record
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(iconEndTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				)
			},
		},
	]

	return (
		<Modal
			width='60%'
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_ProductStatus')}</div>
			}
			onCancel={onCancel}
			footer={false}
		>
			<Row align='middle' justify='center'>
				<Col span={12}>
					<Form
						layout='vertical'
						size='middle'
						form={filterModalForm}
						initialValues={{
							lobbyCategoryId: Number(head(lobbyCategoryList)?.id),
						}}
					>
						<Form.Item label={t('Label_LobbyCategory')} name='lobbyCategoryId'>
							<Select placeholder='select'>
								{lobbyCategoryList.map(({ id, name }) => (
									<Option key={Number(id)} value={Number(id)}>
										{name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Form>
				</Col>
			</Row>
			<Form form={editForm} component={false}>
				<Table
					loading={
						headerSettingGroupByTpGameIdNoListFetching ||
						isUpdateHeaderSettingByTpGameIdLoading
					}
					columns={columns}
					dataSource={headerSettingGroupByTpGameIdNoList}
					pagination={false}
					scroll={{ y: 400 }}
				/>
			</Form>
		</Modal>
	)
}

export default ProductStatusModal
