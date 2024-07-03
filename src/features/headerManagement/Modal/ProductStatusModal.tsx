import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { head } from 'lodash'
import { Table } from 'components'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { timeFormat } from 'common/utils/format'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	Col,
	DatePicker,
	Form,
	message,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Switch,
	Tag,
	Typography,
} from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import {
	ICON_STATUS_TAGS,
	IconTypeList,
} from 'features/headerManagement/constatns'
import {
	IEditProductStatusForm,
	IFilterProductStatusModalForm,
	IHeaderSettingEnum,
	IHeaderSettingGroupByTpGameIdNoData,
	IHeaderSettingRlsToPrdArgsEnum,
	IHeaderSettingRlsToPrdEnum,
	ILobbyCategoryData,
} from 'features/headerManagement/type'
import {
	useGetHeaderSettingGroupByTpGameIdNoListQuery,
	useUpdateHeaderSettingByTpGameIdMutation,
	useUpdateHeaderSettingEnvironmentMutation,
} from 'features/headerManagement/api'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'

interface IProductStatusModalProps {
	visible: boolean
	onCancel: () => void
	lobbyCategoryList: ILobbyCategoryData[]
	editPermission?: PermissionInterface
}

const { Option } = Select
const { RangePicker } = DatePicker

dayjs.extend(isBetween)

const ProductStatusModal = forwardRef(
	(
		{
			visible,
			onCancel,
			lobbyCategoryList,
			editPermission,
		}: IProductStatusModalProps,
		ref
	) => {
		const { t } = useTranslation()
		const { timeZoneUtcOffset } = useTimeZone()
		const [filterModalForm] = Form.useForm<IFilterProductStatusModalForm>()
		const [editForm] = Form.useForm<IEditProductStatusForm>()
		const formLobbyCategoryId = Form.useWatch(
			'lobbyCategoryId',
			filterModalForm
		)
		const { siteId } = useAppSelector(selectUserSite) ?? {}
		const [editingKey, setEditingKey] = useState<number | undefined>(undefined)

		const ref1 = useRef(null)
		const ref2 = useRef(null)
		const ref3 = useRef(null)
		const ref4 = useRef(null)
		const ref5 = useRef(null)
		const divRef = useRef(null)

		useImperativeHandle(ref, () => ({
			step1: () => ref1.current,
			step2: () => ref2.current,
			step3: () => ref3.current,
			step4: () => ref4.current,
			step5: () => ref5.current,
			step6: () => divRef.current,
		}))

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

		const [
			updateHeaderSettingEnvironment,
			{ isLoading: isUpdateHeaderSettingEnvironmentLoading },
		] = useUpdateHeaderSettingEnvironmentMutation()

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

		const handleSwitchRlsPrd = async ({
			tpGameIdNo,
			status,
		}: {
			tpGameIdNo: number
			status: boolean
		}) => {
			if (!siteId) return

			try {
				await updateHeaderSettingEnvironment({
					siteId,
					tpGameIdNo,
					isPRD: status
						? IHeaderSettingRlsToPrdArgsEnum.True
						: IHeaderSettingRlsToPrdArgsEnum.False,
				}).unwrap()
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
			status,
			iconType,
		}: IHeaderSettingGroupByTpGameIdNoData) => {
			editForm.setFieldsValue({
				dateRange: [dayjs(iconStartTime), dayjs(iconEndTime)],
				status: Boolean(status),
				iconType,
			})
			setEditingKey(tpGameIdNo)
		}

		const isEditing = (record: IHeaderSettingGroupByTpGameIdNoData) =>
			record.tpGameIdNo === editingKey

		const columns = [
			{
				title: t('Label_RLS_TO_PRD'),
				key: 'switchToPrd',
				width: 80,
				align: 'center' as 'center',
				render: (record: IHeaderSettingGroupByTpGameIdNoData) => {
					const { status, tpGameIdNo } = record
					// * 這裡跟 status 共用參數，但狀態是 rls:1,prd: 3 (status 是開：1, 關:0)
					const rlsToPrdStatus = status === IHeaderSettingRlsToPrdEnum.Release
					return (
						<Popconfirm
							disabled={
								// * status 狀態在0 時不可打開
								!editPermission?.canUse || status === IHeaderSettingEnum.False
							}
							title={t('Label_AreYouSure')}
							onConfirm={() =>
								handleSwitchRlsPrd({ tpGameIdNo, status: !rlsToPrdStatus })
							}
						>
							<Switch
								checked={rlsToPrdStatus}
								disabled={
									!editPermission?.canUse || status === IHeaderSettingEnum.False
								}
							/>
						</Popconfirm>
					)
				},
			},
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
							<Switch disabled={!editPermission?.canUse} />
						</Form.Item>
					) : (
						<Switch checked={Boolean(status)} disabled />
					)
				},
			},
			{
				title: t('Label_Icon_Active'),
				key: 'active',
				width: 80,
				align: 'center' as 'center',
				render: (record: IHeaderSettingGroupByTpGameIdNoData) => {
					const { iconType, iconStartTime, iconEndTime } = record
					const isActiveDateTime = dayjs().isBetween(iconStartTime, iconEndTime)

					const isActive = Boolean(iconType) && isActiveDateTime

					return isActive ? (
						<CheckCircleOutlined style={{ fontSize: 16, color: '#3EA62E' }} />
					) : (
						<CloseCircleOutlined style={{ fontSize: 16, color: '#C70707' }} />
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
							<Select placeholder='select'>
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
							initialValue={DATE_RANGES.Today}
							rules={[
								{
									required: true,
									message: t('Label_DateRangeRequire'),
								},
							]}
						>
							<RangePicker
								style={{ width: '100%' }}
								ranges={RANGE_PICKER_RANGES([
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
							{dayjs(iconStartTime)
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
							{dayjs(iconEndTime)
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
					<div style={{ textAlign: 'left' }}>{t('Label_ProductStatus')}</div>
				}
				onCancel={onCancel}
				destroyOnClose
				footer={false}
			>
				<Row align='middle' gutter={16}>
					<Col lg={4} md={12} xs={12} ref={ref1}>
						<Form
							layout='vertical'
							size='middle'
							form={filterModalForm}
							initialValues={{
								lobbyCategoryId: Number(head(lobbyCategoryList)?.id),
							}}
						>
							<Form.Item
								label={t('Label_LobbyCategory')}
								name='lobbyCategoryId'
							>
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

				<Row align='middle' gutter={16}>
					<Col lg={24}>
						<Typography.Text style={{ fontSize: 12 }}>
							{t('Label_HeaderMenu_Product_Description_1')}
						</Typography.Text>
					</Col>
				</Row>

				<Form form={editForm} component={false}>
					<Table
						loading={
							headerSettingGroupByTpGameIdNoListFetching ||
							isUpdateHeaderSettingByTpGameIdLoading ||
							isUpdateHeaderSettingEnvironmentLoading
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
)

export default ProductStatusModal
