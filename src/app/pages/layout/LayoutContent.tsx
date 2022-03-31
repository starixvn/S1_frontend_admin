import { FC } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const LayoutContent: FC = () => {
	return (
		<Content
			style={{
				margin: 0,
				padding: "24px 0",
				minHeight: "340px"
			}}>
			<Outlet />
		</Content>
	);
};
export { LayoutContent };
