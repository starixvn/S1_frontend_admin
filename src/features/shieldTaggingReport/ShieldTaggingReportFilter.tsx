import {
	Button,
	Col,
	Collapse,
	DatePicker,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { MultipleSelect } from 'components/Select'
import { IFilterForm } from 'features/shieldTaggingReport/type'
import { IEnumTypeData } from 'common/service/enumApi'

interface ShieldTaggingReportFilterProps {
	loading: boolean
	form: FormInstance<IFilterForm>
	timeZoneUtcOffset?: number
	shieldPlatformList: IEnumTypeData[]
	shieldRiskList: IEnumTypeData[]
	triggeredPointsList: IEnumTypeData[]
	onTimeZoneChange: (newUtcOffset: number) => void
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const ShieldTaggingReportFilter = ({
	loading,
	form,
	timeZoneUtcOffset,
	shieldPlatformList,
	shieldRiskList,
	triggeredPointsList,
	onTimeZoneChange,
	onSearch,
}: ShieldTaggingReportFilterProps) => {
	const { t } = useTranslation()

	const platformTypeSelector = () => {
		const onChangePlatformType = (newPlatformTypes: Array<number | string>) => {
			if (newPlatformTypes.includes('all')) {
				form.setFieldsValue({
					platform: shieldPlatformList.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					platform: newPlatformTypes,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangePlatformType}
				placeholder={t('Label_Select')}
			>
				{(shieldPlatformList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{shieldPlatformList?.map(({ name, value }) => (
					<Option key={value} value={value}>
						{name}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const triggerPointTypeSelector = () => {
		const onChangeTriggerPointType = (
			newTriggerPointTypes: Array<number | string>
		) => {
			if (newTriggerPointTypes.includes('all')) {
				form.setFieldsValue({
					triggeredPoints: triggeredPointsList.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					triggeredPoints: newTriggerPointTypes,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeTriggerPointType}
				placeholder={t('Label_Select')}
			>
				{(triggeredPointsList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{triggeredPointsList?.map(({ name, value }) => (
					<Option key={value} value={value}>
						{name}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const taggedTypeSelector = () => {
		const onChangeTaggedType = (newTaggedTypes: Array<number | string>) => {
			if (newTaggedTypes.includes('all')) {
				form.setFieldsValue({
					tags: shieldRiskList.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					tags: newTaggedTypes,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeTaggedType}
				placeholder={t('Label_Select')}
			>
				{(shieldRiskList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{shieldRiskList?.map(({ name, value }) => (
					<Option key={value} value={value}>
						{name}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card>
					<Form layout='vertical' size='middle' form={form} onFinish={onSearch}>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_DateRange')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
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
													'Last 7 Day',
													'This Month',
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
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='platform' label={t('Label_Platform')}>
									{platformTypeSelector()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item
									name='triggeredPoints'
									label={t('Label_TriggeredPoints')}
								>
									{triggerPointTypeSelector()}
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='tags' label={t('Label_Tagged')}>
									{taggedTypeSelector()}
								</Form.Item>
							</Col>

							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>

						<Row align='middle' gutter={16}>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='shieldId' label={t('Label_ShieldId')}>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>

						<br />
						<Row justify='end' align='middle'>
							<Col>
								<Button
									loading={loading}
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

export default ShieldTaggingReportFilter
