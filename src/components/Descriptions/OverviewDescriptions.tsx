import styled from 'styled-components'
import { ReactNode, Children } from 'react'
import { Descriptions, DescriptionsProps, Space, Spin, Typography } from 'antd'

export const CustomDivider = styled.div`
	height: 0.5px;
	width: 100%;
	background-color: rgba(192, 192, 192, 0.29);
`

const renderOverviewDescriptionsItems = (
	label: string = '',
	values: (string | number)[] = []
) => {
	return (
		<Descriptions.Item
			label={label}
			style={{
				textAlign: 'center',
				paddingLeft: 0,
				paddingRight: 0,
				minWidth: '100px',
			}}
			span={1}
		>
			<Space direction='vertical' style={{ width: '100%' }}>
				{values.map(value => (
					<>
						<Typography.Text>{value}</Typography.Text>
						<CustomDivider />
					</>
				))}
			</Space>
		</Descriptions.Item>
	)
}

interface IOverviewDescriptionsProps extends DescriptionsProps {
	loading?: boolean
	children: ReactNode
}

const OverviewDescriptions = ({
	loading = false,
	children,
	...props
}: IOverviewDescriptionsProps) => {
	const column = Children.count(children)

	return (
		<Spin spinning={loading}>
			<Descriptions
				layout='vertical'
				bordered
				size='small'
				column={column}
				style={{
					margin: '10 0 10 10',
					overflowX: 'auto',
				}}
				{...props}
			>
				{children}
			</Descriptions>
		</Spin>
	)
}

export { OverviewDescriptions, renderOverviewDescriptionsItems }
