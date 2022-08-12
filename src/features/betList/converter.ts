import { OrderByTypeEnum } from 'features/betList/type'

export const orderDirectionConverter = (orderBy: string) => {
	return orderBy === 'ascend'
		? (OrderByTypeEnum.ascend as number)
		: (OrderByTypeEnum.descend as number)
}
