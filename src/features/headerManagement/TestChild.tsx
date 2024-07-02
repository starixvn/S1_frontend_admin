// ChildComponent.tsx
import { Button, Modal, Typography } from 'antd'
import React, { forwardRef, Ref } from 'react'

interface Props {
	isModalOpen: boolean
	showModal: () => void
	handleOk: () => void
	handleCancel: () => void
}

// 定義 Props 接口
interface Props {
	isModalOpen: boolean
	showModal: () => void
	handleOk: () => void
	handleCancel: () => void
}

// 指定 ref 是 HTMLDivElement 的 ref 並且使用 Props 接口
const ChildComponent = forwardRef<HTMLDivElement, Props>(
	({ isModalOpen, showModal, handleOk, handleCancel }, ref) => {
		return (
			<>
				<Button type='primary' onClick={showModal}>
					Open Modal
				</Button>
				<Modal
					title='Basic Modal'
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
				>
					<Typography.Text ref={ref}>S213123123ome contents...</Typography.Text>
					<p>Some contents...</p>
					<p>Some contents...</p>
					<p>Some contents...</p>
				</Modal>
			</>
		)
	}
)

export default ChildComponent
