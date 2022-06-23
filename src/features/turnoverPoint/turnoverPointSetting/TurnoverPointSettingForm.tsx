import { FC } from 'react'
import { Button, Col, Form, FormInstance, Input, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { CheckOutlined } from '@ant-design/icons'
import { LayoutContent } from 'app/pages/layout'
import { IGetTurnoverPointSettingData } from '../type'

interface TurnoverPointSettingFormInterface {
	loading: boolean
	turnoverSettingData: IGetTurnoverPointSettingData[]
	form: FormInstance
}
const TurnoverPointSettingForm: FC<TurnoverPointSettingFormInterface> = ({
	loading,
	turnoverSettingData,
	form,
}) => {
	const { t } = useTranslation()
	// const rowCreater = (rowData: IGetTurnoverPointSettingData): JSX.Element => {
	// 	return (
	//
	// 	)
	//
	// }
	return (
		<LayoutContent.Card style={{ marginTop: 0 }}>
			<Form form={form} layout='horizontal' onFinish={() => {}}>
				<Row
					align='middle'
					gutter={16}
					style={{ marginTop: 16, marginBottom: 16 }}
				>
					<Col lg={6}>
						<Form.Item
							name='turnover'
							label='Sports'
							colon
							labelAlign='left'
							style={{
								margin: 'auto',
							}}
						>
							<Input type='number' allowClear />
						</Form.Item>
					</Col>
					<Col lg={4}>
						<Typography.Text> get 1 point</Typography.Text>
					</Col>
				</Row>

				<Row justify='end' align='middle'>
					<Col>
						<Button
							loading={loading}
							icon={<CheckOutlined />}
							htmlType='submit'
							type='primary'
						>
							{t('Label_Submit')}
						</Button>
					</Col>
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export { TurnoverPointSettingForm }
