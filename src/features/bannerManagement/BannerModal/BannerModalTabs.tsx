import { FormInstance, Tabs } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import BannerModalTabsPanel from 'features/bannerManagement/BannerModal/BannerModalTabsPanel'
import { IAddForm } from 'features/bannerManagement/type'

interface IBannerModalTabsProps {
	form: FormInstance<IAddForm>
	languageList: string[]
	actionMode: number | string
}

const BannerModalTabs = ({
	form,
	languageList,
	actionMode,
}: IBannerModalTabsProps) => {
	const items = languageList?.map(lang => {
		return {
			label: lang,
			key: lang,
			forceRender: true,
			children: (
				<BannerModalTabsPanel form={form} lang={lang} actionMode={actionMode} />
			),
		}
	})
	return (
		<LayoutContent.Card>
			<Tabs type='card' style={{ height: 300 }} items={items} />
		</LayoutContent.Card>
	)
}

export default BannerModalTabs
