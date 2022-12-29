import { InputNumber, InputNumberProps } from 'antd'

interface IBaseInputNumberProps extends InputNumberProps {}

const BaseInputNumber = (props: IBaseInputNumberProps) => {
	return (
		<InputNumber
			type='number'
			controls={false}
			style={{ width: '100%' }}
			// 新增這行是為了避免 Antd Input 元件在 type = 'number' 因為 滾動滾輪造成數字改變
			// 這是來自 Antd 元件的 bug , 解決方法只能使用 type = 'text' , 但 string 不符合這裡要的 type
			// @ts-ignore
			onWheel={() => document.activeElement.blur()}
			{...props}
		/>
	)
}

export { BaseInputNumber as InputNumber }
