import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Collapse, Form, Input, Row, FormInstance, Select } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { WEEK_DAYS } from 'app/constants/weekMapping'

const { Panel } = Collapse
const { Option } = Select

interface VipRebatePeriodFilterInterface {
	form: FormInstance<any>
	editable: boolean
}

enum PeriodTypesEnum {
	Daily = 1,
	Weekly,
	Monthly,
}

// 暫時關閉 Monthly
const periodTypesLabel: Array<{ value: number; label: string }> = [
	{ value: PeriodTypesEnum.Daily, label: 'Label_Daily' },
	{ value: PeriodTypesEnum.Weekly, label: 'Label_Weekly' },
	// { value: PeriodTypesEnum.Monthly, label: 'Label_Monthly' },
]

const VipRebateManagementFilter: FC<VipRebatePeriodFilterInterface> = ({
	form,
	editable,
}) => {
	const { t } = useTranslation()
	const type: number = Form.useWatch('periodType', form)

	const periodTypeSwitch = () => {
		switch (type) {
			case PeriodTypesEnum.Daily:
				return (
					<Col lg={8} md={16} xs={16}>
						<Form.Item
							name='redeemHours'
							label={t('Label_PayTime')}
							rules={[
								{
									required: true,
									message: t('Label_RedeemHoursRequired'),
								},
								{
									pattern: /^1[0-9]$|^2[0-4]$|^[0-9]$/,
									message: t('Label_MinMax', { min: 0, max: 24 }),
								},
							]}
						>
							<Input type='number' placeholder={t('Label_RedeemHours')} />
						</Form.Item>
					</Col>
				)
			case PeriodTypesEnum.Weekly:
				return (
					<Col lg={16} md={24} xs={24}>
						<Row gutter={16}>
							<Col lg={12} md={12} xs={12}>
								<Form.Item name='periodDay' label={t('Label_WeekOption')}>
									<Select
										placeholder={t('Label_Select') + t('Label_WeekOption')}
									>
										{WEEK_DAYS.map(item => (
											<Option key={item.key} value={item.key}>
												{t(item.displayKey)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={12} md={12} xs={12}>
								<Form.Item
									name='redeemHours'
									label={t('Label_RedeemHours')}
									rules={[
										{
											required: true,
											message: t('Label_RedeemHoursRequired'),
										},
										{
											pattern: /^1[0-9]$|^2[0-4]$|^[0-9]$/,
											message: t('Label_MinMax', {
												min: 0,
												max: 24,
											}),
										},
									]}
								>
									<Input placeholder={t('Label_RedeemHours')} type='number' />
								</Form.Item>
							</Col>
						</Row>
					</Col>
				)
			case PeriodTypesEnum.Monthly:
				return (
					<Col lg={16} md={24} xs={24}>
						<Row gutter={16}>
							<Col lg={12} md={12} xs={12}>
								<Form.Item
									name='periodDay'
									label={t('Label_Date')}
									rules={[
										{
											required: true,
											message: t('Label_DateRequired'),
										},
										{
											pattern: /^[1-9]$|^1[0-9]$|^2[0-9]$|^3[0-1]$/,
											message: t('Label_MinMax', {
												min: 1,
												max: 31,
											}),
										},
									]}
								>
									<Input placeholder={t('Label_Date')} type='number' />
								</Form.Item>
							</Col>
							<Col lg={12} md={12} xs={12}>
								<Form.Item
									name='redeemHours'
									label={t('Label_RedeemHours')}
									rules={[
										{
											required: true,
											message: `${t('Label_RedeemHoursRequired')}`,
										},
										{
											pattern: /^1[0-9]$|^2[0-4]$|^[0-9]$/,
											message: t('Label_MinMax', {
												min: 0,
												max: 24,
											}),
										},
									]}
								>
									<Input placeholder={t('Label_RedeemHours')} type='number' />
								</Form.Item>
							</Col>
						</Row>
					</Col>
				)
			default:
				return null
		}
	}
	useEffect(() => {
		if (type === PeriodTypesEnum.Weekly) {
			form.setFieldsValue({ periodDay: 1 })
		}
	}, [type])
	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						disabled={!editable}
						layout='vertical'
						size='middle'
						form={form}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={16} xs={16}>
								<Form.Item
									name='periodType'
									label={`${t('Label_PeriodType')}   ${t(
										'Label_SyncWithCurrency'
									)}`}
								>
									<Select
										placeholder={t('Label_Select') + t('Label_PeriodType')}
									>
										{periodTypesLabel.map(item => (
											<Option key={item.value} value={item.value}>
												{t(item.label)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row align='middle' gutter={24}>
							{periodTypeSwitch()}
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { VipRebateManagementFilter }
