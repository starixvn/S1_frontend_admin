import { Button, Col, Form, FormInstance, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { IGetCategoryData } from 'common/service/allDataApi'
import { IGetGameTypeListData } from 'features/memberProfile/type'
import { MultipleSelect } from 'components/Select'
import { SearchOutlined } from '@ant-design/icons'

interface IWinLossSummaryFilterProps {
	loading: boolean
	filterLoading: boolean
	form: FormInstance
	onSearch: () => void
	categoryList: IGetCategoryData[]
	gameTypeList: IGetGameTypeListData[]
}

const { Option } = Select

const WinLossSummaryFilter = ({
	loading,
	form,
	onSearch,
	categoryList,
	gameTypeList,
	filterLoading,
}: IWinLossSummaryFilterProps) => {
	const { t } = useTranslation()

	const categorySelectRenderer = () => {
		const onChangeCategory = (newCategories: Array<number | string>) => {
			if (newCategories.includes('all')) {
				form.setFieldsValue({
					tpCategoryList: categoryList?.map(item => item.categoryId),
				})
			} else {
				form.setFieldsValue({
					tpCategoryList: newCategories,
				})
			}
			form.resetFields(['gameTypes'])
		}
		return (
			<MultipleSelect
				onChange={onChangeCategory}
				placeholder={t('Label_Select')}
			>
				{(categoryList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{categoryList?.map(item => (
					<Option key={item.categoryId} value={item.categoryId}>
						{item.categoryName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	const gameTypeSelectRenderer = () => {
		const onChangeGameType = (newGameType: Array<number | string>) => {
			if (newGameType.includes('all')) {
				form.setFieldsValue({
					gameTypes: gameTypeList?.map(item => item.type),
				})
			} else {
				form.setFieldsValue({
					gameTypes: newGameType,
				})
			}
		}
		return (
			<MultipleSelect
				onChange={onChangeGameType}
				placeholder={t('Label_Select')}
			>
				{(gameTypeList?.length as number) > 1 && (
					<Option value='all'>{t('Label_SelectAll')}</Option>
				)}

				{gameTypeList?.map(item => (
					<Option key={item.type} value={item.type}>
						{item.typeName}
					</Option>
				))}
			</MultipleSelect>
		)
	}

	return (
		<Spin spinning={filterLoading}>
			<Form
				layout='vertical'
				size='middle'
				form={form}
				onFinish={onSearch}
				initialValues={{
					tpCategoryList: [],
					gameTypes: [],
				}}
			>
				<Row align='middle' gutter={16}>
					<Col lg={8} md={10} xs={10}>
						<Form.Item name='tpCategoryList' label={t('Label_Category')}>
							{categorySelectRenderer()}
						</Form.Item>
					</Col>
					<Col lg={8} md={10} xs={10}>
						<Form.Item name='gameTypes' label={t('Label_GameType')}>
							{gameTypeSelectRenderer()}
						</Form.Item>
					</Col>
					<Col span={3}>
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
		</Spin>
	)
}

export { WinLossSummaryFilter }
