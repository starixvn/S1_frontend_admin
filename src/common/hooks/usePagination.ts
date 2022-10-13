import { useEffect, useState } from 'react'

export const PAGINATION = {
	defaultCurrent: 1,
	defaultPageSize: 25,
	position: ['topLeft'],
	pageSizeOptions: [10, 25, 50, 100, 200, 300],
	hideOnSinglePage: true,
}

export interface PaginationInterface {
	current: number
	pageSize: number
	total: number
	position: string[]
	pageSizeOptions: number[]
}

const usePagination = ({
	paginationTotal,
}: {
	paginationTotal: number
}): [
	PaginationInterface,
	React.Dispatch<React.SetStateAction<PaginationInterface>>
] => {
	const [pagination, setPagination] = useState({
		current: PAGINATION.defaultCurrent,
		pageSize: PAGINATION.defaultPageSize,
		total: 0,
		position: PAGINATION.position,
		pageSizeOptions: PAGINATION.pageSizeOptions,
	})

	useEffect(() => {
		setPagination(prev => {
			const { current, pageSize } = prev

			const newCurrent = paginationTotal % pageSize ? current : 1

			return { ...prev, total: paginationTotal, current: newCurrent }
		})
	}, [paginationTotal])

	return [pagination, setPagination]
}
export { usePagination }
