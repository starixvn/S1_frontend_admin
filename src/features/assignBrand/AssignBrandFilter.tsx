import React, { FC } from 'react'
import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSiteList } from 'common/enum'
import { SearchOutlined } from '@ant-design/icons'

const { Panel } = Collapse
const { Option } = Select

interface AssignBrandFilterProps {
	loading: boolean
	form: FormInstance<any>
	onSearch: ({
		userName,
		selectSites,
	}: {
		userName: string
		selectSites: number[]
	}) => void
	onChangeSites: (newSites: number[]) => void
}

const AssignBrandFilter: FC<AssignBrandFilterProps> = ({
	loading,
	form,
	onSearch,
	onChangeSites,
}) => {
	const { t } = useTranslation()
	const userSiteList = useAppSelector(selectUserSiteList)

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='Search Criteria' key={1}>
				<Form
					layout='vertical'
					size='middle'
					form={form}
					onFinish={onSearch}
					initialValues={{
						selectSites: [],
						userName: '',
					}}
				>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='selectSites' label={t('Label_Brand')}>
								<MultipleSelect onChange={onChangeSites}>
									{(userSiteList?.length as number) > 1 && (
										<Option value={0}>{t('Label_SelectAll')}</Option>
									)}

									{userSiteList?.map(userSite => (
										<Option key={userSite.siteId} value={userSite.siteId}>
											{userSite.siteName}
										</Option>
									))}
								</MultipleSelect>
							</Form.Item>
						</Col>

						<Col lg={6} md={12} xs={12}>
							<Form.Item name='userName' label={t('Label_MemberId')}>
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
			</Panel>
		</Collapse>
	)
}

export default AssignBrandFilter
