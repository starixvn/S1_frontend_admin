import { isNaN } from 'lodash'
import {
	IUpgradeSettingData,
	IUpgradeSettingTableData,
	VipLevelsEnum,
} from 'features/vipUpgradeSetting/type'

// S2C
export const vipUpgradeSettingConverter = (
	list: IUpgradeSettingData[]
): Array<IUpgradeSettingTableData> => {
	return list.map(item => {
		const getLevelValue = (vipLevel: number) => {
			return item.detail.find(levelItem => levelItem.level === vipLevel)
				?.levelValue
		}

		return {
			currencyId: item.currencyId,
			typeName: item.typeName,
			type: item.type,
			vintageClub: Number(getLevelValue(VipLevelsEnum.VintageClub)) || null,
			silverClub: Number(getLevelValue(VipLevelsEnum.SilverClub)) || null,
			goldClub: Number(getLevelValue(VipLevelsEnum.GoldClub)) || null,
			titaniumClub: Number(getLevelValue(VipLevelsEnum.TitaniumClub)) || null,
			diamondClub: Number(getLevelValue(VipLevelsEnum.DiamondClub)) || null,
			// 有可能是 number | string ， number 需編輯，string 直接顯示
			novaClub: !isNaN(Number(getLevelValue(VipLevelsEnum.NovaClub)))
				? Number(getLevelValue(VipLevelsEnum.NovaClub))
				: getLevelValue(VipLevelsEnum.NovaClub),
		}
	})
}
