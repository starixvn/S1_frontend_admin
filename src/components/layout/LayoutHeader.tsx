import React from "react";
import { Button, Col, Dropdown, Layout, Menu, Row, Space } from "antd";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	FileProtectOutlined,
	PoweroffOutlined
} from "@ant-design/icons";
import { useMediaQuery } from "usehooks-ts";
import { useAuth } from "hooks";
import { useTranslation } from "react-i18next";

const { Header } = Layout;

interface LayoutHeaderProps {
	collapsed: boolean;
	onToggleCollapsed: () => void;
}

// TODO: test only, using fetch data later
const SITE_LIST = ["nova88", "goal123", "bwing"];

const LayoutHeader = ({ collapsed, onToggleCollapsed }: LayoutHeaderProps) => {
	const { t } = useTranslation();
	let { onSignOut } = useAuth();
	const mediaMatches = useMediaQuery("(min-width: 768px)");

	const menu = (
		<Menu>
			<Menu.Item disabled={true} icon={<FileProtectOutlined />}>
				{t("Label_ChangePassword")}
			</Menu.Item>

			<Menu.Divider />

			<Menu.Item onClick={onSignOut} icon={<PoweroffOutlined />} danger>
				{t("Label_SignOut")}
			</Menu.Item>
		</Menu>
	);

	const siteMenu = (
		<Menu>
			{SITE_LIST.map(site => (
				<Menu.Item key={site}>{site}</Menu.Item>
			))}
		</Menu>
	);

	return (
		<Header className="layout-header">
			<Menu theme="dark" mode="horizontal" selectedKeys={[]}>
				<Row wrap={false}>
					<Col flex="80px">
						<Menu.Item style={{ cursor: "auto" }}>
							<Button
								type="text"
								onClick={onToggleCollapsed}
								style={{ marginBottom: 16 }}>
								{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
							</Button>
						</Menu.Item>
					</Col>

					<Col flex="auto"></Col>

					{mediaMatches ? (
						<Col flex="260px">
							<Space>
								{SITE_LIST.map(site => (
									<Button key={site} type="text">
										{site}
									</Button>
								))}
							</Space>
						</Col>
					) : (
						<Col flex="96px">
							<Dropdown trigger={["click"]} overlay={siteMenu}>
								<Button type="primary">goal123</Button>
							</Dropdown>
						</Col>
					)}

					<Col flex="52px">
						<Dropdown
							trigger={["click"]}
							overlay={menu}
							placement="bottomRight">
							<Button type="text" style={{ marginBottom: 16 }}>
								<UserOutlined />
							</Button>
						</Dropdown>
					</Col>
				</Row>
			</Menu>
		</Header>
	);
};

export { LayoutHeader };
