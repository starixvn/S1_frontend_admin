import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { head } from 'lodash'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { selectCurrencyListBySite } from 'common/enum'
import { FormInstance } from 'antd/es/form/Form'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, Form, Row, Select, Typography } from 'antd'
import { IFilterForm, ILobbyCategoryData } from 'features/headerManagement/type'

interface IHeaderManagementFilterProps {
	loading: boolean
	isSortMode: boolean
	form: FormInstance<IFilterForm>
	editPermission?: PermissionInterface
	lobbyCategoryList: ILobbyCategoryData[]
	onSearch: () => {}
	onSetProductStatus: () => void
}

const { Panel } = Collapse
const { Option } = Select

const HeaderManagementFilter = forwardRef(
	(
		{
			loading,
			isSortMode,
			form,
			editPermission,
			lobbyCategoryList,
			onSearch,
			onSetProductStatus,
		}: IHeaderManagementFilterProps,
		ref
	) => {
		const { t } = useTranslation()

		const currencyListBySite = useAppSelector(selectCurrencyListBySite)

		const ref1 = useRef(null)
		const ref2 = useRef(null)
		const ref3 = useRef(null)
		const ref4 = useRef(null)
		const ref5 = useRef(null)
		const divRef = useRef(null)

		useImperativeHandle(ref, () => ({
			step1: () => ref1.current,
			step2: () => ref2.current, // 公開 ref3
			step3: () => ref3.current, // 公開 ref3
			step4: () => ref4.current,
			step5: () => ref5.current, // 公開 ref3
			step6: () => divRef.current,
		}))

		useEffect(() => {
			console.log('ref2', ref2.current) // 查看這是指向哪裡
			console.log('ref1', ref1.current) //
			console.log('ref5', ref1.current) //
		}, [])

		return (
			<Collapse defaultActiveKey={1}>
				<Panel header='' key='1' ref={ref1}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={() => onSearch()}
							initialValues={{
								currencyId: head(currencyListBySite)?.currencyId,
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12} ref={ref2}>
									<Form.Item
										name='currencyId'
										label={t('Label_Currency')}
										id='css'
									>
										<Select placeholder='select'>
											{currencyListBySite?.map(item => (
												<Option key={item.currencyId} value={item.currencyId}>
													{item.isoCode}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12} ref={ref3}>
									<Form.Item
										name='lobbyCategoryId'
										label={t('Label_LobbyCategory')}
									>
										<Select placeholder='select'>
											{lobbyCategoryList.map(({ id, name }) => (
												<Option key={Number(id)} value={Number(id)}>
													{name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<br />

							<Row justify='end' align='middle' gutter={16}>
								{/* <Col>
									<Typography.Text style={{ fontSize: 12 }}>
										{t('Label_HeaderMenu_Product_Description_2')}
									</Typography.Text>
								</Col> */}
								<Col>
									<Button
										ref={ref4}
										loading={loading}
										icon={<SearchOutlined />}
										htmlType='submit'
										type='primary'
										disabled={isSortMode}
									>
										{t('Label_Search')}
									</Button>
								</Col>

								{editPermission?.canUse && (
									<Col>
										<Button
											id='css'
											ref={ref5}
											type='primary'
											onClick={onSetProductStatus}
											disabled={isSortMode}
										>
											{t('Label_ProductStatus')}
										</Button>
									</Col>
								)}
							</Row>
						</Form>
					</LayoutContent.Card>
				</Panel>
			</Collapse>
		)
	}
)

export default HeaderManagementFilter
