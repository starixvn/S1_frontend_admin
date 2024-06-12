import { ConfigProvider } from 'antd'
import {
	FC,
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react'

export interface ITheme {
	primaryColor?: string
	bg: string
	headerBg?: string
}

interface IThemeContext {
	theme: ITheme | null
	setTheme: Dispatch<SetStateAction<ITheme | null>>
}

const ThemeContext = createContext<IThemeContext>({
	theme: null,
	setTheme: () => {},
})

export const ThemeProvider: FC = ({ children }) => {
	const [theme, setTheme] = useState<ITheme | null>(null)
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{theme ? (
				<ConfigProvider
					theme={{
						components: {
							Layout: {
								siderBg: 'transparent',
								headerBg: theme.headerBg ?? 'transparent',
								colorBgLayout: theme.bg,
							},
							Menu: {
								darkItemBg: 'transparent',
								darkSubMenuItemBg: 'transparent',
								darkItemSelectedBg: theme.primaryColor,
								darkItemHoverBg: '#c3c3c338',
							},
						},
						// 暫時只在 menu 裡使用 primaryColor
						// token: {
						// 	colorPrimary: theme.primaryColor,
						// 	colorLink: theme.primaryColor,
						// },
					}}
				>
					{children}
				</ConfigProvider>
			) : (
				children
			)}
		</ThemeContext.Provider>
	)
}

export const useThemeContext = () => useContext(ThemeContext)
