import moment from 'moment'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useGetLangCodesQuery } from 'common/service/allDataApi'
import TimeZoneSelect from 'components/TimeZoneSelect'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { PermissionInterface } from 'type'
import {
	Col,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Button,
	Spin,
	DatePicker,
	Switch,
	InputNumber,
} from 'antd'
import {
	IAnnouncementByIdResponse,
	IEditForm,
} from 'features/announcement/type'
import { announcementResConverter } from 'features/announcement/utils'
import AnnouncementTabs from 'features/announcement/announcementmodal/AnnouncementTabs'
import { useGetAnnouncementByIdQuery } from 'features/announcement/api'

interface SetAnnouncementModalProps {
	open: boolean
	form: FormInstance<IEditForm>
	loading: boolean
	editPermission?: PermissionInterface
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onCancel: () => void
	onFinish: (isAdd: boolean) => void
}

const { RangePicker } = DatePicker

const SetAnnouncementModal = ({
	open,
	form,
	loading,
	editPermission,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onCancel,
	onFinish,
}: SetAnnouncementModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const id = form.getFieldValue(['id'])
	const isAdd = id === 'Add'

	// 每次開都重撈資料
	const {
		data: { data: announcementDetail } = {} as IAnnouncementByIdResponse,
		isFetching: isGetAnnouncementDetailLoading,
	} = useGetAnnouncementByIdQuery(
		{
			id,
		},
		{
			skip: isAdd || !id,
			refetchOnMountOrArgChange: true,
		}
	)
	const { data: { data: infos } = {} } = useGetLangCodesQuery({ siteId })
	const { iLangList: langCodes = [] } = infos ?? {}

	useEffect(() => {
		if (!isGetAnnouncementDetailLoading && !isAdd && open) {
			const { status, isTest, seq, subject, content, startTime, endTime } =
				announcementDetail ?? {}
			// subject content 型態相同 帶入固定參數判斷
			const subjectResult = announcementResConverter(subject, 'subject')
			const contentResult = announcementResConverter(content, 'content')

			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				status: Boolean(status),
				isTest: Boolean(isTest),
				seq,
			})

			subjectResult.forEach(item => {
				const { key, subject: subjects } = item ?? {}
				form.setFieldsValue({
					subject: {
						[key]: {
							subject: subjects,
						},
					},
				})
			})

			contentResult.forEach(item => {
				const { key, content: contents } = item ?? {}
				form.setFieldsValue({
					content: {
						[key]: {
							content: contents,
						},
					},
				})
			})
		}
	}, [isGetAnnouncementDetailLoading, open])

	return (
		<Modal
			title={isAdd ? t('Label_AddAnnouncement') : t('Label_EditAnnouncement')}
			open={open}
			onCancel={onCancel}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			onOk={() => onFinish(isAdd)}
			width='60vw'
			confirmLoading={loading}
			// 且為了正確觸發 form 的初始化，故每次關閉便移除整個元件
			afterClose={() => form.resetFields()}
			destroyOnClose
			// 沒編輯權限則關閉 footer submit button
			footer={
				editPermission?.canUse
					? [
							<Button key='back' onClick={onCancel}>
								{t('Label_Cancel')}
							</Button>,
							<Button
								key='submit'
								type='primary'
								loading={loading}
								onClick={() => onFinish(isAdd)}
							>
								{t('Label_Submit')}
							</Button>,
					  ]
					: null
			}
		>
			<Spin spinning={!isAdd && isGetAnnouncementDetailLoading}>
				<Form
					form={form}
					layout='vertical'
					initialValues={{
						seq: '',
						status: false,
						isTest: false,
					}}
					disabled={!editPermission?.canUse}
				>
					<Row align='middle' gutter={16}>
						<Col lg={12} md={12} xs={24}>
							<Form.Item label={t('Label_ActiveDate')}>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='dateRange'
										initialValue={MOMENT_DATE_RANGES.Today}
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
									<div>
										<TimeZoneSelect
											value={timeZoneUtcOffset}
											onChange={onTimeZoneChange}
										/>
									</div>
								</Input.Group>
							</Form.Item>
						</Col>
					</Row>

					<Row align='middle' gutter={16}>
						<Col lg={3} md={12} xs={12}>
							<Form.Item name='seq' label={t('Label_Sort')}>
								<InputNumber min={0} />
							</Form.Item>
						</Col>

						<Col lg={3} md={12} xs={24} offset={1}>
							<Form.Item
								name='status'
								label={t('Label_Status')}
								valuePropName='checked'
							>
								<Switch />
							</Form.Item>
						</Col>

						<Col lg={3} md={12} xs={24}>
							<Form.Item
								name='isTest'
								label={t('Label_IsTest')}
								valuePropName='checked'
							>
								<Switch />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>

			{langCodes?.length > 0 && (
				<AnnouncementTabs
					langCodes={langCodes}
					form={form}
					editPermission={editPermission}
				/>
			)}
		</Modal>
	)
}

export default SetAnnouncementModal
