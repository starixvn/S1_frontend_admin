import { useState } from "react";

export interface ModalState {
	visible: boolean;
	onOpen: () => void;
	onCancel: () => void;
}

const useModal = (): ModalState => {
	const [visible, setVisible] = useState(false);

	const onOpen = () => setVisible(true);

	const onCancel = () => setVisible(false);

	const modal = {
		visible,
		onOpen,
		onCancel
	};

	return modal;
};

export { useModal };
