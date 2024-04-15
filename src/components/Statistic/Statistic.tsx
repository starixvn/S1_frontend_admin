import styled from 'styled-components'
import { Statistic, Space } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'

interface ICustomStatisticProps {
	title?: ReactNode
	value: string | number
	precision?: number
	suffix?: ReactNode
	prefix?: ReactNode
}

const BaseStatistic = styled(Statistic)`
	text-align: center;
`

const CustomStatistic = ({
	title,
	value,
	precision = 2,
	prefix,
	suffix,
	...props
}: ICustomStatisticProps) => (
	<Space wrap>
		<Statistic
			title={title}
			value={value}
			precision={precision}
			valueStyle={{
				fontSize: 12,
				color: (value as number) < 0 ? '#cf1322' : '#3f8600',
			}}
			prefix={
				(value as number) < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />
			}
			suffix='%'
			{...props}
		/>
	</Space>
)

export { BaseStatistic as Statistic, CustomStatistic }
