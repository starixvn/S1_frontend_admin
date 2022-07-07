import { MenuOutlined } from '@ant-design/icons'
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc'
import type { SortableContainerProps } from 'react-sortable-hoc'
import { FC } from 'react'

export const DragHandle = SortableHandle(() => (
	<MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
))

export const SortableItem = SortableElement(
	(props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />
)
export const SortableBody = SortableContainer(
	(props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />
)

export const DraggableContainer = ({
	onSortEnd,
	...props
}: SortableContainerProps) => (
	<SortableBody
		useDragHandle
		disableAutoscroll
		onSortEnd={onSortEnd}
		{...props}
	/>
)

export const DraggableBodyRow: FC<{
	dataSource: any[]
	rowKey: string | number
}> = ({ dataSource, rowKey, ...restProps }) => {
	// function findIndex base on Table rowKey props and should always be a right array index
	const index = dataSource?.findIndex(
		(x: any) => x[rowKey] === (restProps as any)['data-row-key']
	)
	return <SortableItem index={index} {...restProps} />
}
