import { Row, Tag } from 'antd'
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'

interface IStatusInfoComponentProps {
	label: string
	status: boolean
}

const StatusInfoComponent = ({ label, status }: IStatusInfoComponentProps) => {
	return (
		<Row>
			{status ? (
				<Tag icon={<CheckCircleOutlined />} color='success'>
					{label}
				</Tag>
			) : (
				<Tag icon={<QuestionCircleOutlined />} color='default'>
					{label}
				</Tag>
			)}
		</Row>
	)
}

export { StatusInfoComponent }
