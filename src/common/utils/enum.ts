import { FormInstance } from 'antd'
import { IEnumTypeData } from 'common/service/enumApi/type'

/**
 * handle EnumApi MultipleSelect onChange
 * @argument newValues - 傳入當前 Enum 新陣列
 * @argument allValues - 傳入該 Enum 所有資料
 * @argument form - 傳入 antd Form.useForm,
 * @argument enumNameType - 傳入預綁定的 key
 */
export const onEnumApiMultipleSelectChange = (
	newValues: (number | string)[],
	allValues: IEnumTypeData[],
	form: FormInstance,
	enumNameType: string
) => {
	if (newValues.includes('all')) {
		form.setFieldsValue({
			[enumNameType]: allValues?.map(item => item.value),
		})
	} else {
		form.setFieldsValue({
			[enumNameType]: newValues,
		})
	}
}
