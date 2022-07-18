import { FC } from 'react'
import { Form, Select } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { ISortedWorldCupTeamData, ITeamInfo } from './type'

const { Option } = Select

interface IWorldCupSettingTableProps {
	form: FormInstance
	loading: boolean
	selectOptions: ITeamInfo[]
	sortedWorldCupTeamData: ISortedWorldCupTeamData[]
}

const WorldCupSettingTable: FC<IWorldCupSettingTableProps> = ({
	form,
	loading,
	selectOptions,
	sortedWorldCupTeamData,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Sort'),
			dataIndex: 'sort',
			width: '30px',
			align: 'center' as 'center',
		},
		{
			title: 'top32Team',
			dataIndex: 'top32Team',
			width: '15%',
			align: 'center' as 'center',
			render: (top32Team: ITeamInfo) => {
				const { sort } = top32Team
				return (
					<Form.Item
						style={{ margin: 0 }}
						name={[sort, 'top32Team', 'countryId']}
					>
						<Select placeholder={t('Label_Select')} allowClear>
							{selectOptions?.map(item => (
								<Option key={item.countryName} value={item.countryId}>
									{item.countryName}
								</Option>
							))}
						</Select>
					</Form.Item>
				)
			},
		},
		{
			title: 'roundOf16',
			width: '15%',
			align: 'center' as 'center',
			render: (record: ISortedWorldCupTeamData) => {
				const { roundOf16: { sort } = {} as ITeamInfo, index } = record
				// * 只可選 16 隊
				if (index >= 16) return ''
				return (
					<Form.Item
						style={{ margin: 0 }}
						name={[sort, 'roundOf16', 'countryId']}
					>
						<Select placeholder={t('Label_Select')} allowClear>
							{selectOptions?.map(item => (
								<Option key={item.countryName} value={item.countryId}>
									{item.countryName}
								</Option>
							))}
						</Select>
					</Form.Item>
				)
			},
		},
		{
			title: 'quarterFinals',
			width: '15%',
			align: 'center' as 'center',
			render: (record: ISortedWorldCupTeamData) => {
				const { quarterFinals: { sort } = {} as ITeamInfo, index } = record
				// * 只可選 8 隊
				if (index >= 8) return ''
				return (
					<Form.Item
						style={{ margin: 0 }}
						name={[sort, 'quarterFinals', 'countryId']}
					>
						<Select placeholder={t('Label_Select')} allowClear>
							{selectOptions?.map(item => (
								<Option key={item.countryName} value={item.countryId}>
									{item.countryName}
								</Option>
							))}
						</Select>
					</Form.Item>
				)
			},
		},
		{
			title: 'semiFinals',
			width: '15%',
			align: 'center' as 'center',
			render: (record: ISortedWorldCupTeamData) => {
				const { quarterFinals: { sort } = {} as ITeamInfo, index } = record
				// * 只可選 4 隊
				if (index >= 4) return ''
				return (
					<Form.Item
						style={{ margin: 0 }}
						name={[sort, 'semiFinals', 'countryId']}
					>
						<Select placeholder={t('Label_Select')} allowClear>
							{selectOptions?.map(item => (
								<Option key={item.countryName} value={item.countryId}>
									{item.countryName}
								</Option>
							))}
						</Select>
					</Form.Item>
				)
			},
		},
		{
			title: '3rdPlace',
			width: '15%',
			align: 'center' as 'center',
			render: (record: ISortedWorldCupTeamData) => {
				const { index } = record
				const { sort } = record['3rdPlace'] as ITeamInfo
				// * 只可選 3 隊
				if (index >= 3) return ''
				return (
					<Form.Item
						style={{ margin: 0 }}
						name={[sort, '3rdPlace', 'countryId']}
					>
						<Select placeholder={t('Label_Select')} allowClear>
							{selectOptions?.map(item => (
								<Option key={item.countryName} value={item.countryId}>
									{item.countryName}
								</Option>
							))}
						</Select>
					</Form.Item>
				)
			},
		},
		{
			title: 'final',
			width: '15%',
			align: 'center' as 'center',
			render: (record: ISortedWorldCupTeamData) => {
				const { final: { sort } = {} as ITeamInfo, index } = record

				// * 只可選 2 隊
				if (index >= 2) return ''
				return (
					<Form.Item style={{ margin: 0 }} name={[sort, 'final', 'countryId']}>
						<Select placeholder={t('Label_Select')} allowClear>
							{selectOptions?.map(item => (
								<Option key={item.countryName} value={item.countryId}>
									{item.countryName}
								</Option>
							))}
						</Select>
					</Form.Item>
				)
			},
		},
	]

	return (
		<Form form={form} component={false}>
			<Table
				loading={loading}
				columns={columns}
				dataSource={sortedWorldCupTeamData}
				pagination={false}
			/>
		</Form>
	)
}

export default WorldCupSettingTable
