import { useState } from 'react'

export interface PaginationInterface {
	current?: number
	pageSize?: number
	position: string[]
}

const usePagination = (): [
	PaginationInterface,
	React.Dispatch<
		React.SetStateAction<{
			current: number
			pageSize: number
			position: string[]
			pageSizeOptions: number[]
		}>
	>
] => {
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		position: ['topLeft'],
		pageSizeOptions: [10, 25, 50, 100, 200, 300, 1000],
	})

	return [pagination, setPagination]
}
export { usePagination }
