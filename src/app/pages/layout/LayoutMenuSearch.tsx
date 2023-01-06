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

	const handleKeyPress = ({ metaKey, altKey, key }: KeyboardEvent) => {
		const isKey = key === 'K' || key === 'k'
		if (isKey && (metaKey || altKey)) {
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
			suffixIcon='alt+k'
			autoFocus
			showSearch
			placeholder={t('Label_SearchPage')}
			style={{ width: '100%' }}
			options={menuPaths}
			onChange={path => navigate(path)}
			filterOption={handleFilterOption}
			// * 阻止預設行為，讓鍵盤方向鍵可以控制 option target
			onKeyDown={e => e.stopPropagation()}
		/>
	)
}

export { LayoutMenuSearch }
