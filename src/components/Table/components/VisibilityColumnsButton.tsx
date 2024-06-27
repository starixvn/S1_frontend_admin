import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, Dropdown, Menu, MenuProps } from 'antd'
import { filter, includes, isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useScrollPosition, useQueryParams } from 'common/hooks'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { ColumnsType } from 'antd/es/table'

const StyleMenu = styled(Menu)`
	max-height: 250px;
	overflow-y: scroll;
`

export const useVisibilityColumnsButtonHook = () => {
	const [visibilityColumns, setVisibilityColumns] = useState<string[]>([])

	const onChangeVisibilityColumns = (keys: string[]) => {
		setVisibilityColumns(keys)
	}

	const onGetVisibilityColumns = (baseColumns: ColumnsType<any>) =>
		baseColumns.filter(({ title }) => includes(visibilityColumns, title))

	return {
		onChangeVisibilityColumns,
		onGetVisibilityColumns,
	}
}

const VisibilityColumnsButton = ({
	baseColumns,
	onTableVisibilityColumnsChange,
	memoried,
	initialColumns = baseColumns,
}: {
	baseColumns: any[]
	onTableVisibilityColumnsChange: (keys: any[]) => void
	// 用於判斷是否需要記住前值
	memoried?: boolean
	initialColumns?: typeof baseColumns
}) => {
	const ref = useRef(null)
	const { t } = useTranslation()
	const [queryParams, setQueryParams] = useQueryParams()
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

		if (memoried) {
			const args = queryParams
			result = filter(visibilityColumns, item => item !== key)
			setQueryParams({
				...args,
				visibilityColumns: result,
			})
		}
	}

	const handleInit = () => {
		const initialColumnTitles = initialColumns.map(column => column?.title)
		setVisibilityColumns(initialColumnTitles)
		onTableVisibilityColumnsChange(initialColumnTitles)
	}

	useEffect(() => {
		closeVisible()
	}, [scrollPosition])

	useEffect(() => {
		const { visibilityColumns: queryVisibilityColumns = [] } = queryParams
		if (!isEmpty(queryVisibilityColumns)) {
			setVisibilityColumns(queryVisibilityColumns)
			onTableVisibilityColumnsChange(queryVisibilityColumns)
		} else {
			handleInit()
		}
	}, [])

	const menuItems: ItemType[] = baseColumns.map(column => ({
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
