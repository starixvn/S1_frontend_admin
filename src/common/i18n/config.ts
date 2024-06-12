import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { SITE_INFO } from 'app/config'
import enFlag from 'assets/images/langs/en.png'
import thFlag from 'assets/images/langs/th.png'
import en from './en.json'
import th from './th.json'

export const languages = [
	{ lang: 'en', translations: en, label: 'English', image: enFlag },
	{ lang: 'th', translations: th, label: 'ไทย', image: thFlag },
]

i18next.use(initReactI18next).init({
	lng: SITE_INFO.DEFAULT_LANG,
	fallbackLng: SITE_INFO.DEFAULT_LANG,
	debug: process.env.NODE_ENV === 'development',
	supportedLngs: languages.map(({ lang }) => lang),
	interpolation: { escapeValue: false },
	// transSupportBasicHtmlNodes: true,
	// transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
	resources: languages.reduce(
		(acc, { lang, translations }) => ({ ...acc, [lang]: { translations } }),
		{}
	),
	defaultNS: 'translations',
	react: {
		// transEmptyNodeValue: ""
	},
})

export default i18next
