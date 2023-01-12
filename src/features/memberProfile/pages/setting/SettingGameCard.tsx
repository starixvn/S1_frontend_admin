import React from 'react'
import { Card, Col, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { MENU_MAPPING } from 'app/constants/menuMapping'
import { find } from 'lodash'
import { OLD_SITE_PREFIX_URL } from 'app/config'
import { Link } from 'react-router-dom'
import paths from 'app/constants/paths'
import { useActionPermissionsByFunctionId } from 'common/auth'

const SettingGameCard = () => {
	const { t } = useTranslation()

	const { actionPermissions: betLimitActionPermissions } =
		useActionPermissionsByFunctionId({
			functionId: paths.member.sub.betLimit.functionId,
		})

	const { actionPermissions: gameExclusionActionPermissions } =
		useActionPermissionsByFunctionId({
			functionId: paths.member.sub.gameExclusion.functionId,
		})

	// TODO: 等 BetLimit 及 GameExclusion 兩頁翻新之後，這裡需要一起更新路徑
	const betLimitPath = find(MENU_MAPPING, { functionId: 63 })?.newAdminPath
	const gameExclusionPath = find(MENU_MAPPING, { functionId: 62 })?.internalPath

	return (
		<Col xxl={4} xl={4} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Game')} style={{ height: '100%' }}>
				<p>
					{betLimitActionPermissions.viewPermission ? (
						<Link to={`/${OLD_SITE_PREFIX_URL}/${betLimitPath}`}>
							{t('Label_BetLimit')}
						</Link>
					) : (
						<Typography.Link disabled>{t('Label_BetLimit')}</Typography.Link>
					)}
				</p>

				<p>
					{gameExclusionActionPermissions.viewPermission ? (
						<Link to={`/${OLD_SITE_PREFIX_URL}/${gameExclusionPath}`}>
							{t('Label_GameExclusion')}
						</Link>
					) : (
						<Typography.Link disabled>
							{t('Label_GameExclusion')}
						</Typography.Link>
					)}
				</p>
			</Card>
		</Col>
	)
}

export default SettingGameCard
