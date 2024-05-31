import { Col, Row, Typography } from 'antd'
import { toUpper } from 'lodash'

const { Title } = Typography

const LayoutContentTitle = ({ title }: { title: string }) => {
	return (
		<Row style={{ margin: '16px' }} justify='space-between' align='middle'>
			<Col>
				<Title level={4}>{toUpper(title)}</Title>
			</Col>
		</Row>
	)
}

export { LayoutContentTitle }
