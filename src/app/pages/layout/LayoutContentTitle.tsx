import { Col, Row, Typography } from 'antd'
import _ from 'lodash'

const { Title, Text } = Typography

const LayoutContentTitle = ({ title }: { title: string }) => {
	return (
		<Row style={{ margin: '16px' }} justify='space-between' align='middle'>
			<Col>
				<Title level={4}>
					<Text strong> {_.toUpper(title)}</Text>
				</Title>
			</Col>
		</Row>
	)
}

export { LayoutContentTitle }
