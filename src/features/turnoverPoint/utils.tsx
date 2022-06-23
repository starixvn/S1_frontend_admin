import { IGetTpCategoryData } from './type'
import { PermissionInterface } from '../../type'
interface IColumnCreator {
	(
		categoryList: IGetTpCategoryData[],
		editPermission?: PermissionInterface
	): void
}
