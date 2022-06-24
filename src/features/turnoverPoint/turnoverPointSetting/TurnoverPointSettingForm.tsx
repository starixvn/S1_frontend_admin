import { FC, useEffect, useState } from 'react'
import {
	DatePicker,
	Form,
	FormInstance,
	Input,
	Space,
	Switch,
	Table,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import moment from 'moment'
import { get } from 'lodash'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import { useTimeZone } from 'components/TimeZoneSelect'
import { IGetTurnoverPointSettingData } from '../type'

interface TurnoverPointSettingFormInterface {
	loading: boolean
	turnoverSettingData: IGetTurnoverPointSettingData[]
	form: FormInstance
}

const { RangePicker } = DatePicker

const TurnoverPointSettingForm: FC<TurnoverPointSettingFormInterface> = ({
	loading,
	turnoverSettingData,
	form,
}) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const [statuses, setStatus] = useState({})
	const columns = [
		{
			title: t('Label_GameType'),
			width: 100,
			align: 'center' as 'center',
			dataIndex: 'tpCategoryName',
			key: 'tpCategoryName',
			render: (tpCategoryName: string) => `${tpCategoryName} : `,
		},
		{
			title: t('Label_PointRate'),
			width: 100,
			align: 'center' as 'center',
			key: 'turnover',
			render: (values: IGetTurnoverPointSettingData) => {
				const { tpCategoryName } = values
				return (
					<Form.Item
						name={[tpCategoryName, 'turnover']}
						style={{
							margin: 0,
						}}
					>
						<Input type='number' allowClear />
					</Form.Item>
				)
			},
		},
		{
			width: 100,
			align: 'center' as 'center',
			dataIndex: 'pointRate',
			key: 'pointRate',
			render: (pointRate: number) =>
				t('Label_GetPointMessage', { point: pointRate }),
		},
		{
			title: t('Label_PromotionDate'),
			width: '240px',
			align: 'center' as 'center',
			key: 'promotionStatus',
			render: (values: IGetTurnoverPointSettingData) => {
				const { tpCategoryName, promotionStatus } = values
				const status = get(statuses, tpCategoryName) ?? promotionStatus

				return (
					<Space align='center'>
						<Form.Item
							noStyle
							name={[tpCategoryName, 'promotionStatus']}
							initialValue={MOMENT_DATE_RANGES.Today}
						>
							<Switch
								onClick={checked =>
									setStatus(prev => {
										return {
											...prev,
											...{ [tpCategoryName]: checked },
										}
									})
								}
								defaultChecked={Boolean(promotionStatus)}
							/>
						</Form.Item>

						<Form.Item
							name={[tpCategoryName, 'promotionDateRange']}
							style={{ margin: 0 }}
							rules={[{ required: true }]}
						>
							<RangePicker
								disabled={!status}
								format={time =>
									moment(time).utcOffset(timeZoneUtcOffset).format('YYYY-MM-DD')
								}
								ranges={MOMENT_RANGE_PICKER_RANGES([
									'Today',
									'Last 7 Day',
									'This Month',
								])}
							/>
						</Form.Item>
					</Space>
				)
			},
		},
		{
			title: t('Label_PromotionPointRate'),
			width: 120,
			align: 'center' as 'center',
			key: 'promotionPointRate',
			render: (values: IGetTurnoverPointSettingData) => {
				const { promotionStatus, tpCategoryName } = values
				const status = get(statuses, tpCategoryName) ?? promotionStatus

				return (
					<Space style={{ whiteSpace: 'nowrap' }}>
						{t('Label_PointRate')}
						<Form.Item
							name={[tpCategoryName, 'promotionPointRate']}
							style={{
								margin: 0,
							}}
						>
							<Input type='number' disabled={!status} allowClear />
						</Form.Item>
					</Space>
				)
			},
		},
	]
	useEffect(() => {
		if (!loading && turnoverSettingData) {
			turnoverSettingData.forEach(item => {
				const {
					turnover,
					tpCategoryName,
					tpCategoryId,
					pointRate,
					promotionStatus,
					promotionPointRate,
					promotionStartTime,
					promotionEndTime,
				} = item
				setStatus(prev => {
					return {
						...prev,
						...{
							[tpCategoryName]: Boolean(promotionStatus),
						},
					}
				})
				form.setFieldsValue({
					[tpCategoryName]: {
						promotionPointRate: promotionStatus ? promotionPointRate : 0,
						turnover,
						tpCategoryName,
						tpCategoryId,
						pointRate,
						promotionStatus,
						promotionDateRange: promotionStatus
							? [moment(promotionStartTime), moment(promotionEndTime)]
							: [null, null],
					},
				})
			})
		}
	}, [loading])

	return (
		<LayoutContent.Card style={{ marginTop: 0 }}>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					columns={columns}
					dataSource={turnoverSettingData ?? []}
					pagination={false}
					scroll={{ x: 800 }}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { TurnoverPointSettingForm }
