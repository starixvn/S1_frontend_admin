import { Form, FormInstance } from 'antd'
import React, { FC, useContext } from 'react'

export const FormContext = React.createContext<FormInstance<any> | null>(null)

export const FormProvider: FC = ({ children }) => {
	const [form] = Form.useForm()

	return (
		<Form form={form} component={false}>
			<FormContext.Provider value={form}>{children}</FormContext.Provider>
		</Form>
	)
}

export const useFormContext = () => {
	return useContext(FormContext) as FormInstance<any>
}
