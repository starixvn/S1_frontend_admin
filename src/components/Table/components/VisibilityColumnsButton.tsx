import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, Dropdown, Menu, MenuProps } from 'antd'
import { filter, includes } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useScrollPosition } from 'common/hooks'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

const StyleMenu = styled(Menu)`
	max-height: 250px;
	overflow-y: scroll;
`

const VisibilityColumnsButton = ({
	columns,
	onTableVisibilityColumnsChange,
}: {
	columns: any[]
	onTableVisibilityColumnsChange: (keys: any[]) => void
}) => {
	const ref = useRef(null)
	const { t } = useTranslation()
	const scrollPosition = useScrollPosition()
	const [isVisible, setIsVisible] = useState(false)
	const [visibilityColumns, setVisibilityColumns] = useState<string[]>([])

	const closeVisible = () => setIsVisible(false)

	const toggleVisible = () => setIsVisible(prev => !prev)

	const handleClick: MenuProps['onClick'] = ({ key }) => {
		if (key === 'all') {
			handleInit()
			return
		}

		let result: string[] = []
		if (includes(visibilityColumns, key)) {
			result = filter(visibilityColumns, item => item !== key)
		} else {
			result = Array.from(new Set([...visibilityColumns, key]))
		}

		setVisibilityColumns(result)
		onTableVisibilityColumnsChange(result)
	}

	const handleInit = () => {
		const initialColumns = columns.map(column => column?.title)
		setVisibilityColumns(initialColumns)
		onTableVisibilityColumnsChange(initialColumns)
	}

	useEffect(() => {
		closeVisible()
	}, [scrollPosition])

	useEffect(() => {
		handleInit()
	}, [])

	const menuItems: ItemType[] = columns.map(column => ({
		key: column.title,
		label: column.title,
	}))

	const menu = (
		<StyleMenu
			selectedKeys={visibilityColumns}
			onClick={handleClick}
			items={[{ key: 'all', label: t('Label_All') }, ...menuItems]}
		/>
	)

	return (
		<Dropdown open={isVisible} overlay={menu} placement='bottom'>
			<Button ref={ref} onClick={toggleVisible}>
				{t('Label_ColumnVisibility')}
			</Button>
		</Dropdown>
	)
}

export { VisibilityColumnsButton }
