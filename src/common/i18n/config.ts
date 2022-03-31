import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { SITE_INFO } from "app/config";
import en from "./en.json";

const resources = {
	en: { translations: en }
};

i18next.use(initReactI18next).init({
	lng: SITE_INFO.DEFAULT_LANG,
	fallbackLng: SITE_INFO.DEFAULT_LANG,
	debug: process.env.NODE_ENV === "development",
	supportedLngs: SITE_INFO.LANG_LIST,
	interpolation: {
		escapeValue: false
	},
	// transSupportBasicHtmlNodes: true,
	// transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
	resources,
	defaultNS: "translations",
	react: {
		// transEmptyNodeValue: ""
	}
});

export default i18next;
