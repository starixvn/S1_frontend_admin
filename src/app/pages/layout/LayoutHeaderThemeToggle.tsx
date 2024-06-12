import { BgColorsOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import themes from 'app/constants/themes'
import { useThemeContext } from 'common/context/ThemeContext'

const customTheme = themes.jackfish

const LayoutHeaderThemeToggle = () => {
	const { theme, setTheme } = useThemeContext()
	return (
		<Button
			type={theme ? 'primary' : 'text'}
			onClick={() => setTheme(prev => (prev ? null : customTheme))}
			shape='circle'
		>
			<BgColorsOutlined style={{ fontSize: 16 }} />
		</Button>
	)
}

export default LayoutHeaderThemeToggle
