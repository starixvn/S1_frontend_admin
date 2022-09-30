import { Row, Tag } from 'antd'
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'

interface IStatusInfoComponentProps {
	label: string
	status: boolean
}

export const StyleTag = styled(Tag)`
	font-size: 12px;
	padding: 2px 10px;
`

const StatusInfoComponent = ({ label, status }: IStatusInfoComponentProps) => {
	return (
		<Row>
			{status ? (
				<StyleTag icon={<CheckCircleOutlined />} color='success'>
					{label}
				</StyleTag>
			) : (
				<StyleTag icon={<QuestionCircleOutlined />} color='default'>
					{label}
				</StyleTag>
			)}
		</Row>
	)
}

export { StatusInfoComponent }
