import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'

const DeviceList = () => {
	const { t } = useTranslation()

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_DeviceList')}
			/>
			<LayoutContent.Card />
		</>
	)
}

export default DeviceList
