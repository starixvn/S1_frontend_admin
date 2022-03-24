import React from "react";
import { Link } from "react-router-dom";
import {
	LaptopOutlined,
	NotificationOutlined,
	UserOutlined,
	SearchOutlined
} from "@ant-design/icons";
import { Input, Layout, Menu, Tooltip } from "antd";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

const LayoutSideBar = ({
	collapsed,
	onToggleCollapsed
}: {
	collapsed: boolean;
	onToggleCollapsed: () => void;
}) => {
	return (
		<Sider
			trigger={null}
			breakpoint="lg"
			collapsedWidth="0"
			collapsible
			collapsed={collapsed}
			onCollapse={onToggleCollapsed}>
			<Header className="header">
				<Link to="/dashboard">
					<img
						width={80}
						src="https://image.0814media.net/SiteSkin/img/logo_en.png"
						alt="logo"
					/>
				</Link>
			</Header>

			<Menu
				selectable={false}
				theme="dark"
				mode="inline"
				style={{ height: "100%", borderRadius: 0 }}>
				<Menu.Item key="search" style={{ cursor: "auto" }}>
					<Input
						disabled={true}
						placeholder="search..."
						prefix={
							<Tooltip title="Extra information">
								<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />
							</Tooltip>
						}
					/>
				</Menu.Item>
				<SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
					<Menu.Item key="1">option1</Menu.Item>
					<Menu.Item key="2">option2</Menu.Item>
					<Menu.Item key="3">option3</Menu.Item>
					<Menu.Item key="4">option4</Menu.Item>
				</SubMenu>
				<SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
					<Menu.Item key="5">option5</Menu.Item>
					<Menu.Item key="6">option6</Menu.Item>
					<Menu.Item key="7">option7</Menu.Item>
					<Menu.Item key="8">option8</Menu.Item>
				</SubMenu>
				<SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
					<Menu.Item key="9">option9</Menu.Item>
					<Menu.Item key="10">option10</Menu.Item>
					<Menu.Item key="11">option11</Menu.Item>
					<Menu.Item key="12">option12</Menu.Item>
				</SubMenu>
			</Menu>
		</Sider>
	);
};

export { LayoutSideBar };
