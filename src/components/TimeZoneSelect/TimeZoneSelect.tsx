import { FC } from 'react'
import { Select, SelectProps } from 'antd'
import { TIME_ZONE_LIST } from './constants'

const { Option } = Select

const TimeZoneSelect: FC<SelectProps> = ({ style, ...props }) => {
	return (
		<Select {...props} style={{ width: 70, ...style }}>
			{TIME_ZONE_LIST.map(({ offset, label }) => (
				<Option key={offset} value={offset}>
					{label}
				</Option>
			))}
		</Select>
	)
}

export { TimeZoneSelect }
