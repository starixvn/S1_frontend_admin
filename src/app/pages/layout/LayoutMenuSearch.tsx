import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { replace, toLower } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DefaultOptionType } from 'antd/lib/select'

const LayoutMenuSearch = ({
	menuPaths,
}: {
	menuPaths: SelectProps['options'] | undefined
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const handleFilterOption = (
		input: string,
		option: DefaultOptionType | undefined
	) => {
		const { label = '' } = option ?? {}
		// * 去除空白字元並轉小寫再進行比對
		return toLower(replace(label as string, /\s/g, ''))?.includes(
			toLower(replace(input, /\s/g, ''))
		)
	}

	return (
		<Select
			autoFocus
			showSearch
			placeholder={t('Label_SearchPage')}
			style={{ width: '100%' }}
			options={menuPaths}
			onChange={path => navigate(path)}
			filterOption={handleFilterOption}
		/>
	)
}

export { LayoutMenuSearch }
