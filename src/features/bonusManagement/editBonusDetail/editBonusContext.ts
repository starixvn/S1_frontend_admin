import React, { createContext } from 'react'
import { FormInstance } from 'antd'
import { Currency } from 'common/enum/type'
import { PermissionInterface } from 'type'
import { IGetPromotionCategoryData } from 'features/bonusManagement/type'

interface IEditBonusContextProps {
	form?: FormInstance
	categoryList: IGetPromotionCategoryData[]
	currentActiveCurrency: Currency
	onEditDetailClick: () => void
	onSetGroupBonusClick: () => void
	editPermission?: PermissionInterface
	setCurrentCurrency?: React.Dispatch<React.SetStateAction<Currency>>
	setCurrentTabActive?: React.Dispatch<React.SetStateAction<boolean>>
	setInfoTabsKey?: React.Dispatch<React.SetStateAction<string>>
}

const onEditDetailClick = () => {}
const onSetGroupBonusClick = () => {}

const initValue = {
	categoryList: [],
	currentActiveCurrency: {} as Currency,
	onEditDetailClick,
	onSetGroupBonusClick,
}

export const EditBonusContext = createContext<IEditBonusContextProps>(initValue)
