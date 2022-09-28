import { IGetBasicInfoData } from 'features/memberProfile/type'
import { Row, Space, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { StatusInfoComponent } from 'features/memberProfile/sider/StatusInfoComponent'

interface IStatusInfoProps {
	custBasicInfo: IGetBasicInfoData
}

const StatusInfo = ({ custBasicInfo }: IStatusInfoProps) => {
	const { t } = useTranslation()
	const { isRisk, isKyc, isTest, tagList } = custBasicInfo ?? {}
	return (
		<Space direction='vertical'>
			<StatusInfoComponent label={t('Label_isRisk')} status={isRisk} />
			<StatusInfoComponent label={t('Label_isKyc')} status={isKyc} />
			<StatusInfoComponent label={t('Label_isTest')} status={isTest} />
			<Row>
				{tagList?.map(tag => (
					<Tag
						key={tag.id}
						color={tag.tagColour}
						style={{ marginRight: '6px', marginTop: '6px' }}
					>
						{tag.tagName}
					</Tag>
				))}
			</Row>
		</Space>
	)
}

export { StatusInfo }
