import { IGetThirdPartyAccountData } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { Card, List } from 'antd'

interface IThirdPartyAccountsTableProps {
	loading: boolean
	thirdPartyAccounts: IGetThirdPartyAccountData[]
}
const ThirdPartyAccountsTable = ({
	loading,
	thirdPartyAccounts,
}: IThirdPartyAccountsTableProps) => {
	return (
		<LayoutContent.Card style={{ marginTop: -20 }}>
			<List
				loading={loading}
				grid={{ gutter: 16, column: 4 }}
				dataSource={thirdPartyAccounts ?? []}
				renderItem={item => (
					<List.Item>
						<Card title={item.tpName}>{item.tpUserName}</Card>
					</List.Item>
				)}
				style={{ marginTop: '10px' }}
			/>
		</LayoutContent.Card>
	)
}

export { ThirdPartyAccountsTable }
