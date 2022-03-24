import React from "react";
import { Breadcrumb, Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const LayoutContent = () => {
	return (
		<Content
			style={{
				padding: 24,
				margin: 0,
				minHeight: 280
			}}>
			<Breadcrumb style={{ margin: "8px 8px" }}>
				<Breadcrumb.Item>Home</Breadcrumb.Item>
				<Breadcrumb.Item>List</Breadcrumb.Item>
				<Breadcrumb.Item>App</Breadcrumb.Item>
			</Breadcrumb>

			<Outlet />
		</Content>
	);
};
export { LayoutContent };
