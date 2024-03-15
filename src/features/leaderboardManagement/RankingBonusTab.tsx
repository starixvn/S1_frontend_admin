import {
	ILeaderboardRankingBonusData,
	IRankingData,
} from 'features/leaderboardManagement/type'
import { useTranslation } from 'react-i18next'
import { Card, FormInstance, Tabs } from 'antd'
import { RankingBonusForm } from 'features/leaderboardManagement/RankingBonusForm'
import { PermissionInterface } from 'type'
import React from 'react'

interface IRankingBonusTabProps {
	isInEdit: boolean
	form: FormInstance<IRankingData>
	loading: boolean
	editingKey: string | undefined
	editPermission?: PermissionInterface
	leaderboardRankingBonusData: ILeaderboardRankingBonusData[]
	onSave: ({
		currencyId,
		record,
	}: {
		currencyId: number
		record: IRankingData
	}) => void
	setEditingKey: React.Dispatch<React.SetStateAction<string | undefined>>
}
const RankingBonusTab = ({
	isInEdit,
	form,
	loading,
	editingKey,
	setEditingKey,
	editPermission,
	leaderboardRankingBonusData,
	onSave,
}: IRankingBonusTabProps) => {
	const { t } = useTranslation()
	const items = leaderboardRankingBonusData.map(rankingData => {
		const { data = [], currencyId, currency } = rankingData
		return {
			label: currency,
			key: currency,
			children: (
				<RankingBonusForm
					isInEdit={isInEdit}
					form={form}
					loading={loading}
					currencyId={currencyId}
					rankingBonusData={data}
					onSave={onSave}
					editPermission={editPermission}
					editingKey={editingKey}
					setEditingKey={setEditingKey}
				/>
			),
		}
	})

	return (
		<Card
			title={t('Label_SetRankingBonus')}
			bordered={false}
			style={{ marginTop: 20, marginBottom: 20 }}
		>
			<Tabs
				defaultActiveKey='1'
				type='card'
				items={items}
				onTabClick={() => setEditingKey(undefined)}
			/>
		</Card>
	)
}

export { RankingBonusTab }
