import moment from 'moment'
import { useEffect } from 'react'
import {
	Col,
	Form,
	Modal,
	FormInstance,
	Input,
	Row,
	Spin,
	Switch,
	Button,
	DatePicker,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useGetLangCodesQuery } from 'common/service/allDataApi'
import { IEditForm } from 'features/newsManagement/type'
import { JSONParser } from 'features/newsManagement/utils'
import { useGetNewsByIdQuery } from 'features/newsManagement/api'
import { NewsManagementEditor } from 'features/newsManagement/EditNewsModal/EditNewsEditor'

interface INewsManagementModalProps {
	open: boolean
	form: FormInstance<IEditForm>
	loading: boolean
	editPermission?: PermissionInterface
	timeZoneUtcOffset: number
	onCancel: () => void
	onFinish: () => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const NewsManagementModal = ({
	open,
	form,
	loading,
	editPermission,
	timeZoneUtcOffset,
	onCancel,
	onFinish,
	onTimeZoneChange,
}: INewsManagementModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const { data: { data: infos } = {} } = useGetLangCodesQuery({ siteId })
	const { iLangList: langCodes = [] } = infos ?? {}

	const newsId = form.getFieldValue(['newsId'])
	const isAdd = newsId === 'Add'

	const { data: { data: newsById } = {}, isFetching: isGetNewsByIdLoading } =
		useGetNewsByIdQuery(
			{ newsId },
			{ skip: isAdd || !newsId, refetchOnMountOrArgChange: true }
		)

	useEffect(() => {
		if (!isGetNewsByIdLoading && !isAdd && open) {
			const {
				postTime: rawPostTime,
				status: rawStatus,
				sort,
				title: rawTitle = '',
				imageURL: rawImageUrl = '',
				content: rawContent = '',
			} = newsById ?? {}

			const imageUrl = JSONParser({ key: 'imageUrl', value: rawImageUrl })
			const title = JSONParser({ key: 'title', value: rawTitle })
			const content = JSONParser({ key: 'content', value: rawContent })
			const postTime = moment(rawPostTime)
			const status = Boolean(rawStatus === 1)

			form.setFieldsValue({
				status,
				newsId,
				postTime,
				sort,
				imageUrl,
				title,
				content,
			})
		}
	}, [isGetNewsByIdLoading, open])

	return (
		<Modal
			title={t('Label_NewsInfo')}
			width='60vw'
			open={open}
			onOk={onFinish}
			onCancel={onCancel}
			confirmLoading={loading}
			afterClose={() => form.resetFields()}
			destroyOnClose
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
								onClick={onFinish}
							>
								{t('Label_Submit')}
							</Button>,
					  ]
					: null
			}
		>
			<Spin spinning={isGetNewsByIdLoading}>
				<Form
					form={form}
					layout='vertical'
					disabled={!editPermission?.canUse}
					initialValues={{
						sort: 0,
						status: false,
					}}
				>
					{!isAdd && (
						<Row align='middle' gutter={16}>
							<Col span={12}>
								<Form.Item name='newsId' label={t('Label_NewsId')}>
									<Input disabled />
								</Form.Item>
							</Col>
						</Row>
					)}
					<Row align='middle' gutter={16}>
						<Col md={12} xs={24}>
							<Form.Item label={t('Label_PostTime')}>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										label={t('Label_PostTime')}
										name='postTime'
										initialValue={moment()}
									>
										<DatePicker showTime style={{ width: '100%' }} />
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
					<Col md={10} xs={24}>
						<Form.Item
							name='sort'
							label={t('Label_Sort')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Sort'),
									}),
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col md={12} xs={24}>
						<Form.Item
							name='status'
							label={t('Label_Status')}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					</Col>
				</Form>
			</Spin>
			<NewsManagementEditor
				form={form}
				langCodes={langCodes}
				editPermission={editPermission}
			/>
		</Modal>
	)
}

export { NewsManagementModal }
