import { first } from 'lodash'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	Input,
	Row,
	Select,
} from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import { IFilterForm } from 'features/announcement/type'
import { STATUS_OPTIONS } from 'features/announcement/constants'
import { UserSite } from 'common/enum/type'

interface AnnouncementFilterProps {
	userSiteList: UserSite[]
	filterLoading: boolean
	form: FormInstance<IFilterForm>
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const AnnouncementFilter = ({
	filterLoading,
	form,
	timeZoneUtcOffset,
	onTimeZoneChange,
	onSearch,
	userSiteList,
}: AnnouncementFilterProps) => {
	const { t } = useTranslation()

	const siteIdSelector = () => {
		return (
			<Form.Item
				name='siteId'
				label={t('Label_Site')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Site'),
						}),
					},
				]}
			>
				<Select placeholder={t('Label_Select')}>
					{userSiteList?.map(item => (
						<Option key={item.siteId} value={item.siteId}>
							{item.siteName}
						</Option>
					))}
				</Select>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key={1}>
				<LayoutContent.Card style={{ margin: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							status: first(STATUS_OPTIONS)?.value,
							siteId: first(userSiteList)?.siteId,
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={12} xs={12}>
								<Form.Item label={t('Label_ActiveDate')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
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
							<Col lg={6} md={12} xs={24}>
								{siteIdSelector()}
							</Col>

							<Col lg={6} md={12} xs={24}>
								<Form.Item name='status' label={t('Label_Status')}>
									<Select placeholder={t('Label_SelectStatus')}>
										{STATUS_OPTIONS.map(({ value, displayKey }) => (
											<Option key={value} value={value}>
												{t(displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<br />

						<Row justify='end' align='middle'>
							<Col>
								<Button
									loading={filterLoading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
								>
									{t('Label_Search')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export default AnnouncementFilter
