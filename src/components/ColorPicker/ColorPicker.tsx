import React, { ReactNode, useState } from 'react'
import { Popover, Tag } from 'antd'
import { ChromePicker, ColorResult, ChromePickerProps } from 'react-color'

interface IColorPickerProps extends ChromePickerProps {
	children?: ReactNode
}

export const DEFAULT_COLOR = '#000000'

export const useColorPicker = () => {
	const [color, setColor] = useState(DEFAULT_COLOR)

	const onChangeColor = (colorResult: ColorResult) => {
		setColor(colorResult.hex)
	}
	// 因傳入的資料型態不一樣 故另開一個onChange 用於初始化 color
	const onChangeRawColor = (colorData: string) => {
		setColor(colorData)
	}

	return { color, onChangeColor, onChangeRawColor }
}

const ColorPicker = ({ children, color, ...rest }: IColorPickerProps) => {
	const content = (
		// * 為了預防 drag 過度 render 大多情境上請使用 onChangeComplete 不使用onChange
		<ChromePicker
			styles={{
				default: {
					picker: { padding: '0' },
				},
			}}
			color={color}
			{...rest}
		/>
	)

	return (
		<Popover placement='bottom' content={content} trigger='click'>
			{/* // * 預設顯示 Tag ，如果有其他情境要使用別的元件則使用傳入的元件 */}
			{children || (
				<Tag style={{ cursor: 'pointer' }} color={color as string}>
					{color}
				</Tag>
			)}
		</Popover>
	)
}

export { ColorPicker }
