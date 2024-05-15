import { Button, Col, Form, FormInstance, Row, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { IEnumTypeData } from 'common/service/enumApi'
import { LayoutContent } from 'app/pages/layout'
import { MultipleSelect } from 'components/Select'
import { BANNER_STATUS_OPTIONS } from 'features/bannerManagement/constants'
import { IFilterForm } from 'features/bannerManagement/type'
import { useTranslation } from 'react-i18next'

const { Option } = Select

interface IBannerManagementFilterProps {
	form: FormInstance<IFilterForm>
	loading: boolean
	bannerTypeList: IEnumTypeData[]
	onSearch: ({
		current,
		pageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => void
}

const BannerManagementForm = ({
	form,
	loading,
	bannerTypeList,
	onSearch,
}: IBannerManagementFilterProps) => {
	const { t } = useTranslation()

	const bannerTypeSelector = () => {
		const onChangeBannerType = (newBannerTypes: Array<number | string>) => {
			if (newBannerTypes.includes('all')) {
				form.setFieldsValue({
					bannerTypes: bannerTypeList.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					bannerTypes: newBannerTypes,
				})
			}
		}

		return (
			<MultipleSelect
				onChange={onChangeBannerType}
				placeholder={t('Label_Select')}
			>
				{(bannerTypeList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}
				{bannerTypeList?.map(({ name, value }) => (
					<Option key={value} value={value}>
						{name}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const bannerStatusSelector = () => {
		const onChangeBannerStatus = (newBannerTypes: Array<number | string>) => {
			if (newBannerTypes.includes('all')) {
				form.setFieldsValue({
					statuses: BANNER_STATUS_OPTIONS.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					statuses: newBannerTypes,
				})
			}
		}

		return (
			<MultipleSelect
				onChange={onChangeBannerStatus}
				placeholder={t('Label_Select')}
			>
				<Option value='all'>{t('Label_SelectAll')}</Option>
				{BANNER_STATUS_OPTIONS?.map(({ displayName, value }) => (
					<Option key={value} value={value}>
						{t(displayName)}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	return (
		<LayoutContent.Card style={{ marginTop: 0 }}>
			<Form
				layout='vertical'
				size='middle'
				form={form}
				onFinish={onSearch}
				initialValues={{
					statuses: BANNER_STATUS_OPTIONS.map(({ value }) => value),
					bannerTypes: [],
				}}
			>
				<Row align='middle' gutter={16}>
					<Col lg={6} md={12} xs={12}>
						<Form.Item label={t('Label_Type')} name='bannerTypes'>
							{bannerTypeSelector()}
						</Form.Item>
					</Col>
					<Col lg={6} md={12} xs={12}>
						<Form.Item label={t('Label_Status')} name='statuses'>
							{bannerStatusSelector()}
						</Form.Item>
					</Col>
				</Row>
				<Row justify='end' align='middle'>
					<Col>
						<Form.Item label={' '}>
							<Button
								loading={loading}
								icon={<SearchOutlined />}
								htmlType='submit'
								type='primary'
							>
								{t('Label_Search')}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export default BannerManagementForm
