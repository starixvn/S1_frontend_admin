import { FC } from 'react'
import { Spin, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { BonusInfoEditForm } from 'features/bonusManagement/editBonusDetail/BonusInfoEditForm'

interface IBannerFormProps {
	loading: boolean
	langCodes: string[]
	currentTabActive: boolean
}

const BannerInfoEditTab: FC<IBannerFormProps> = ({
	loading,
	langCodes,
	currentTabActive,
}) => {
	const items = langCodes?.map(langCode => {
		return {
			label: langCode,
			key: langCode,
			forceRender: true,
			children: (
				<BonusInfoEditForm
					loading={loading}
					langCode={langCode}
					currentTabActive={currentTabActive}
				/>
			),
		}
	})
	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
				<Tabs defaultActiveKey='1' type='card' items={items} />
			</LayoutContent.Card>
		</Spin>
	)
}

export { BannerInfoEditTab }
