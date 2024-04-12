import { FC } from 'react'
import { Form, Select } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { ISortedCupEventTeamData, ITeamInfo } from './type'

const { Option } = Select

interface ICupEventSettingTableProps {
	form: FormInstance
	loading: boolean
	selectOptions: ITeamInfo[]
	sortedCupEventTeamData: ISortedCupEventTeamData[]
}

const CupEventSettingTable: FC<ICupEventSettingTableProps> = ({
	form,
	loading,
	selectOptions,
	sortedCupEventTeamData,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Sort'),
			width: '30px',
			align: 'center' as 'center',
			render: (record: ISortedCupEventTeamData) => {
				const { top24Team: { sort } = {} as ITeamInfo, index } = record
				if (index >= 24) return ''
				return sort
			},
		},
		{
			title: 'top24Team',
			width: '15%',
			align: 'center' as 'center',
			render: (record: ISortedCupEventTeamData) => {
				const { top24Team: { sort } = {} as ITeamInfo, index } = record
				// * 只可選 24 隊
				if (index >= 24) return ''
				return (
					<Form.Item
						style={{ margin: 0 }}
						name={[sort, 'top24Team', 'countryId']}
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
			render: (record: ISortedCupEventTeamData) => {
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
			render: (record: ISortedCupEventTeamData) => {
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
			render: (record: ISortedCupEventTeamData) => {
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
			title: 'final',
			width: '15%',
			align: 'center' as 'center',
			render: (record: ISortedCupEventTeamData) => {
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
				dataSource={sortedCupEventTeamData}
				pagination={false}
			/>
		</Form>
	)
}

export default CupEventSettingTable
