import React from 'react'
import { Card, Col, Form, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { MENU_MAPPING } from 'app/constants/menuMapping'
import { find } from 'lodash'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { Link } from 'react-router-dom'
import paths from 'app/constants/paths'
import { useAuth, useModal } from 'common/hooks'
import { useActionPermissionsByFunctionId } from 'common/auth'
import LiveStreamingGameModal from 'features/memberProfile/pages/setting/AddSettingGameCard/LiveStreamingGameModal'
// import { useSetCustTpGameTypeSettingMutation } from 'features/memberProfile/api'
// import { CustTpGameTypeSettingEnum } from 'features/memberProfile/constants'
import { IAddLiveStreamingForm } from 'features/memberProfile/type'

interface ISettingGameCardProps {
	custId: number
}

const SettingGameCard = ({ custId }: ISettingGameCardProps) => {
	const { t } = useTranslation()
	const [addForm] = Form.useForm<IAddLiveStreamingForm>()
	const { actionPermissions: betLimitActionPermissions } =
		useActionPermissionsByFunctionId({
			functionId: paths.member.sub.betLimit.functionId,
		})

	const { actionPermissions: gameExclusionActionPermissions } =
		useActionPermissionsByFunctionId({
			functionId: paths.member.sub.gameExclusion.functionId,
		})
	// liveStreaming 沒有對應的 functionId
	const { actionPermissions: { setLiveStreamingGamePermission } = {} } =
		useAuth()

	const liveStreamingGameModal = useModal()

	// const [setCustTpGameTypeSetting] = useSetCustTpGameTypeSettingMutation()

	const betLimitPath = find(MENU_MAPPING, { functionId: 63 })?.newAdminPath
	const gameExclusionPath = find(MENU_MAPPING, { functionId: 62 })?.newAdminPath

	const handleSetLiveStreamingGame = async () => {
		// form 裡的 tpId 純做篩選顯示用 api 用不到
		// const { selectedGameTypes } = await addForm.validateFields()
		// if (Object.values(selectedGameTypes).length > 0) {
		// const tpGameTypes = Object.values(selectedGameTypes).map(
		// 	({ gameTypes }) => {
		// 		return console.log(gameTypes)
		// 	}
		// )
		// let tpGameTypes: any = []
		// Object.values(selectedGameTypes).map(values =>
		// 	tpGameTypes.push(values?.gameTypes.map(({value}):any => value))
		// )
		// console.log(tpGameTypes)
		// }
		// try {
		// 	const response = await setCustTpGameTypeSetting({
		// 		custId,
		// 		// 帶 api 裡的定值 IsPlay
		// 		setDataType: CustTpGameTypeSettingEnum.IsPlay,
		// 		tpGameTypes,
		// 	}).unwrap()
		// 	message.success(response?.message || t('System.Label_Success'))
		// 	liveStreamingGameModal.onCancel()
		// } catch (error) {
		// 	message.error(
		// 		(error as Error)?.message || t('System.Label_NotExpectedServerError')
		// 	)
		// }
	}

	return (
		<Col xxl={4} xl={4} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Game')} style={{ height: '100%' }}>
				<p>
					{betLimitActionPermissions.viewPermission ? (
						<Link to={`/${NEW_SITE_PREFIX_URL}/${betLimitPath}`}>
							{t('Label_BetLimit')}
						</Link>
					) : (
						<Typography.Link disabled>{t('Label_BetLimit')}</Typography.Link>
					)}
				</p>

				<p>
					{gameExclusionActionPermissions.viewPermission ? (
						<Link to={`/${NEW_SITE_PREFIX_URL}/${gameExclusionPath}`}>
							{t('Label_GameExclusion')}
						</Link>
					) : (
						<Typography.Link disabled>
							{t('Label_GameExclusion')}
						</Typography.Link>
					)}
				</p>
				<p>
					{setLiveStreamingGamePermission?.canUse ? (
						<Typography.Link onClick={liveStreamingGameModal.onOpen}>
							{t('Label_LiveStreamingGame')}
						</Typography.Link>
					) : (
						<Typography.Link disabled>
							{t('Label_LiveStreamingGame')}
						</Typography.Link>
					)}
				</p>
			</Card>

			<LiveStreamingGameModal
				custId={custId}
				loading={false}
				form={addForm}
				visible={liveStreamingGameModal.visible}
				onCancel={liveStreamingGameModal.onCancel}
				onFinish={handleSetLiveStreamingGame}
			/>
		</Col>
	)
}

export default SettingGameCard
