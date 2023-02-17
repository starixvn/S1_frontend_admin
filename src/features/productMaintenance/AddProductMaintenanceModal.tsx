import { first } from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import {
	Col,
	Row,
	Form,
	Input,
	Modal,
	Select,
	DatePicker,
	FormInstance,
} from 'antd'
import { IGetProductsData, ITpListData } from 'common/service/allDataApi'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'

interface IAddProductMaintenanceModalProps {
	loading: boolean
	form: FormInstance
	timeZoneUtcOffset: number
	tpList: ITpListData[]
	addGameTypeList: IGetProductsData[]
	visible: boolean
	onCancel: () => void
	onFinish: () => void
	onTimeZoneChange: (newUtcOffset: number) => void
}

const { RangePicker } = DatePicker
const { Option } = Select

const AddProductMaintenanceModal = ({
	loading,
	form,
	timeZoneUtcOffset,
	tpList,
	addGameTypeList,
	visible,
	onCancel,
	onFinish,
	onTimeZoneChange,
}: IAddProductMaintenanceModalProps) => {
	const { t } = useTranslation()

	const gameTypeSelector = () => {
		const onChangeGameType = (newGameTypes: Array<number | string>) => {
			if (newGameTypes.includes('all')) {
				form.setFieldsValue({
					tpGameType: addGameTypeList.map(
						({ type, categoryId }) => `${type}-${categoryId}`
					),
				})
			} else {
				form.setFieldsValue({
					tpGameType: newGameTypes,
				})
			}
		}

		return (
			<MultipleSelect
				onChange={onChangeGameType}
				placeholder={t('Label_Select')}
			>
				{/* 舊後台皆有 All 所以沒有判斷長度需大於一 */}
				<Option value='all'>{t('Label_SelectAll')}</Option>
				{addGameTypeList?.map(({ type, typeName, categoryId }) => (
					// 新增的格式為 "type-category ex:1-1"
					<Option key={`${type}-${categoryId}`} value={`${type}-${categoryId}`}>
						{typeName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	useEffect(() => {}, [])

	return (
		<Modal
			confirmLoading={loading}
			title={t('Label_AddMaintenance')}
			open={visible}
			onCancel={onCancel}
			afterClose={() => {
				form.resetFields()
			}}
			onOk={onFinish}
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					tpId: first(tpList)?.id,
					tpGameType: addGameTypeList.map(
						({ type, categoryId }) => `${type}-${categoryId}`
					),
				}}
			>
				<Row align='middle' gutter={16}>
					<Col lg={12} md={12} xs={12}>
						<Form.Item
							name='tpId'
							rules={[{ required: true }]}
							label={t('Label_Vender')}
						>
							<Select placeholder={t('Label_Select')}>
								{tpList?.map(({ id, tpDisplayName }) => (
									<Option key={id} value={id}>
										{tpDisplayName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} xs={12}>
						<Form.Item
							name='tpGameType'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_GameType'),
									}),
								},
							]}
							label={t('Label_GameType')}
						>
							{gameTypeSelector()}
						</Form.Item>
					</Col>
				</Row>

				<Row align='middle' gutter={16}>
					<Col lg={24} md={24} xs={24}>
						<Form.Item label={t('Label_DateRange')}>
							<Input.Group compact style={{ width: '100%', display: 'flex' }}>
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
										showTime
										ranges={MOMENT_RANGE_PICKER_RANGES([
											'Today',
											'Last 7 Day',
											'This Month',
										])}
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
			</Form>
		</Modal>
	)
}

export default AddProductMaintenanceModal
