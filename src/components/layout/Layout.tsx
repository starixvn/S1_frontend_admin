import { useState, FC } from "react";
import { Layout as AntdLayout } from "antd";
import { LayoutSideBar } from "./LayoutSideBar";
import { LayoutHeader } from "./LayoutHeader";
import { LayoutContent } from "./LayoutContent";

const { Footer } = AntdLayout;

const useMenuCollapsed = () => {
	const [collapsed, setCollapsed] = useState<boolean>(true);

	const onToggleCollapsed = () => {
		setCollapsed(prev => !prev);
	};

	return { collapsed, onToggleCollapsed };
};

const Layout: FC = () => {
	const { collapsed, onToggleCollapsed } = useMenuCollapsed();

	return (
		<AntdLayout style={{ minHeight: "100vh" }}>
			<LayoutSideBar
				collapsed={collapsed}
				onToggleCollapsed={onToggleCollapsed}
			/>

			<AntdLayout>
				<LayoutHeader
					collapsed={collapsed}
					onToggleCollapsed={onToggleCollapsed}
				/>

				<AntdLayout style={{ padding: "0 24px 24px" }}>
					<LayoutContent />

					<Footer style={{ textAlign: "center" }}>
						Ant Design ©2022 Created by ailab
					</Footer>
				</AntdLayout>
			</AntdLayout>
		</AntdLayout>
	);
};

export { Layout };
