import { useEffect, useState } from 'react'

export const PAGINATION = {
	defaultCurrent: 1,
	defaultPageSize: 25,
	position: ['topRight'],
	pageSizeOptions: [10, 25, 50, 100, 200, 300],
	hideOnSinglePage: false,
	showSizeChanger: true,
}

export interface PaginationInterface {
	current: number
	pageSize: number
	total: number
	position: string[]
	pageSizeOptions: number[]
	hideOnSinglePage: boolean
	showSizeChanger: boolean
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
		hideOnSinglePage: PAGINATION.hideOnSinglePage,
		showSizeChanger: PAGINATION.showSizeChanger,
	})

	useEffect(() => {
		setPagination(prev => {
			const { current, pageSize } = prev

			const isShowSizeChanger = paginationTotal > PAGINATION.defaultPageSize

			const newCurrent = paginationTotal % pageSize ? current : 1

			return {
				...prev,
				total: paginationTotal,
				current: newCurrent,
				showSizeChanger: isShowSizeChanger,
			}
		})
	}, [paginationTotal])

	return [pagination, setPagination]
}
export { usePagination }
