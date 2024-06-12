import { Button, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { languages } from 'common/i18n/config'

interface LanguageOptionProps {
	lang: string
	label: string
	image: any
}

const LanguageOption = ({ lang, label, image }: LanguageOptionProps) => (
	<>
		<img
			style={{ width: 24, borderRadius: '50%', marginRight: '8px' }}
			src={image}
			alt={lang}
		/>
		<span style={{ width: 48, textAlign: 'left' }}>{label}</span>
	</>
)

const LayoutHeaderLanguageSelect = () => {
	const { i18n } = useTranslation()
	const [savedLang, setSavedLang] = useLocalStorage('lang', 'en')

	useEffect(() => {
		i18n.changeLanguage(savedLang)
	}, [savedLang])

	const handleLanguageChange = (lang: string) => setSavedLang(lang)

	const selectedLang = languages.find(({ lang }) => lang === i18n.language)

	return (
		<Dropdown
			trigger={['click']}
			menu={{
				items: languages.map(({ lang, label, image }) => ({
					key: lang,
					label: <LanguageOption lang={lang} label={label} image={image} />,
					onClick: () => handleLanguageChange(lang),
				})),
			}}
			placement='bottomRight'
		>
			<Button type='text'>
				{selectedLang && (
					<LanguageOption
						lang={selectedLang.lang}
						label={selectedLang.label}
						image={selectedLang.image}
					/>
				)}
				<DownOutlined style={{ fontSize: '10px' }} />
			</Button>
		</Dropdown>
	)
}

export default LayoutHeaderLanguageSelect
