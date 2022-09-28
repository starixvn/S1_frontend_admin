import { LayoutContent } from 'app/pages/layout'
import {
	Button,
	Col,
	Descriptions,
	Divider,
	Row,
	Select,
	Space,
	Table,
	Typography,
} from 'antd'

const { Option } = Select

const Dashboard = () => {
	const dataSource = [
		{
			key: '1',
			name: 'Mike',
			age: 32,
			address: '10 Downing Street',
		},
		{
			key: '2',
			name: 'John',
			age: 42,
			address: '10 Downing Street',
		},
	]

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
	]

	return (
		<>
			<LayoutContent.Card>
				<Row align='middle' gutter={16}>
					<Col xxl={12} xl={24} lg={24} md={24} xs={24}>
						<Descriptions layout='vertical' bordered column={4} size='default'>
							<Descriptions.Item label="Today's WinLoss">
								23,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's Deposit">
								600,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's Withdrawal">
								34,230
							</Descriptions.Item>
							<Descriptions.Item label="Today's Summary">
								78,005
							</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>
					<Col xxl={12} xl={24} lg={24} md={24} xs={24}>
						<Descriptions layout='vertical' bordered column={4} size='default'>
							<Descriptions.Item label='NGR'>34,023</Descriptions.Item>
							<Descriptions.Item label='VOD'>6x</Descriptions.Item>
							<Descriptions.Item label='Member '>1.5%</Descriptions.Item>
							<Descriptions.Item label='Company Margin'>1.5%</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>
				</Row>

				<Row align='middle' gutter={16}>
					<Col xxl={6} xl={12} lg={12} md={12} xs={24}>
						<Descriptions
							layout='horizontal'
							bordered
							column={1}
							size='middle'
							labelStyle={{ width: '120px' }}
						>
							<Descriptions.Item label="Today's WinLoss 1">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 1">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 1">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 1">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 1">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 1">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 1">
								10,000
							</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<Descriptions
							layout='horizontal'
							bordered
							column={1}
							size='middle'
							labelStyle={{ width: '120px' }}
						>
							<Descriptions.Item label="Today's WinLoss 2">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 2">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 2">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 2">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 2">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 2">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 2">
								10,000
							</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<Descriptions
							layout='horizontal'
							bordered
							column={1}
							size='middle'
							labelStyle={{ width: '120px' }}
						>
							<Descriptions.Item label="Today's WinLoss 3">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 3">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 3">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 3">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 3">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 3">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 3">
								10,000
							</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>

					<Col xxl={6} xl={12} lg={12} md={24} xs={24}>
						<Descriptions
							layout='horizontal'
							bordered
							column={1}
							size='middle'
							labelStyle={{ width: '120px' }}
						>
							<Descriptions.Item label="Today's WinLoss 4">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 4">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 4">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 4">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 4">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 4">
								10,000
							</Descriptions.Item>
							<Descriptions.Item label="Today's WinLoss 4">
								10,000
							</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>
				</Row>
			</LayoutContent.Card>

			<Divider />

			<LayoutContent.Card>
				<Row align='middle' gutter={16}>
					<Col lg={12} md={12} xs={12}>
						<Row align='middle' justify='space-between'>
							<Col>
								<Typography.Title level={5}>WinLoss Summary:</Typography.Title>
							</Col>

							<Col>
								<Space>
									<Typography.Link>More</Typography.Link>
								</Space>
							</Col>
						</Row>
						<br />
						<Descriptions layout='horizontal' bordered column={1} size='middle'>
							<Descriptions.Item label='Category Name'>
								WinLoss
							</Descriptions.Item>
							<Descriptions.Item label='Sports'>37.02</Descriptions.Item>
							<Descriptions.Item label='Live Casino'>105</Descriptions.Item>
							<Descriptions.Item label='Slot'>-38,705.2</Descriptions.Item>
							<Descriptions.Item label='Fishing'>35.6</Descriptions.Item>
							<Descriptions.Item label='Lottery'>11.54</Descriptions.Item>
							<Descriptions.Item label='Poker'>11.54</Descriptions.Item>
						</Descriptions>
						<br />
					</Col>

					<Col lg={12} md={12} xs={12}>
						<Row align='middle' justify='space-between'>
							<Col>
								<Typography.Title level={5}>Financial:</Typography.Title>
							</Col>

							<Col>
								<Space>
									<Typography.Link>More</Typography.Link>
									<Select defaultValue='lucy' style={{ width: 120 }}>
										<Option value='jack'>Jack</Option>
										<Option value='lucy'>Lucy</Option>
										<Option value='disabled' disabled>
											Disabled
										</Option>
										<Option value='Yiminghe'>yiminghe</Option>
									</Select>
									<Button style={{ width: '100%' }} type='primary'>
										Search
									</Button>
								</Space>
							</Col>
						</Row>
						<br />
						<Table bordered dataSource={dataSource} columns={columns} />
					</Col>

					<Col lg={12} md={12} xs={12}>
						<Table dataSource={dataSource} columns={columns} />
					</Col>

					<Col lg={12} md={12} xs={12}>
						<Table dataSource={dataSource} columns={columns} />
					</Col>
				</Row>
			</LayoutContent.Card>

			<br />
		</>
	)
}

export default Dashboard
