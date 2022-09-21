import { FC } from 'react'
import { Spin, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { BonusInfoEditForm } from 'features/bonusManagement/editBonusDetail/BonusInfoEditForm'

interface IBannerFormProps {
	loading: boolean
	langCodes: string[]
}

const { TabPane } = Tabs

const BannerInfoEditTab: FC<IBannerFormProps> = ({ loading, langCodes }) => {
	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
				<Tabs defaultActiveKey='1' type='card'>
					{langCodes?.map(langCode => {
						return (
							<TabPane tab={langCode} key={langCode}>
								<BonusInfoEditForm loading={loading} langCode={langCode} />
							</TabPane>
						)
					})}
				</Tabs>
			</LayoutContent.Card>
		</Spin>
	)
}

export { BannerInfoEditTab }
