import { useEffect, useRef } from 'react'
import { Select, RefSelectProps } from 'antd'
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
	const ref = useRef<RefSelectProps>(null)

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

	const handleKeyPress = ({ ctrlKey, key }: KeyboardEvent) => {
		if (ctrlKey && (key === 'K' || key === 'k')) {
			ref.current?.focus()
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [])

	return (
		<Select
			ref={ref}
			suffixIcon='ctrl+k'
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
