import { ISortData } from 'features/hotGameManagement/type'

export const sortingDataConverter = (
	sortIds: number[],
	siteId: number
): ISortData[] => {
	return sortIds.map((id, idx) => {
		return {
			id,
			sort: idx,
			siteId,
		}
	})
}
