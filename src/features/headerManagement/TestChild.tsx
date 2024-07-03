import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { Button, Modal, Typography } from 'antd'

interface Props {
	isModalOpen: boolean
	showModal: () => void
	handleOk: () => void
	handleCancel: () => void
}

export interface ChildComponentHandles {
	textRef: React.RefObject<HTMLSpanElement>
	p1Ref: React.RefObject<HTMLParagraphElement>
	p2Ref: React.RefObject<HTMLParagraphElement>
	p3Ref: React.RefObject<HTMLParagraphElement>
}

const ChildComponent = forwardRef((props: Props, ref) => {
	const { isModalOpen, showModal, handleOk, handleCancel } = props
	const textRef = useRef<HTMLSpanElement>(null)
	const p1Ref = useRef<HTMLParagraphElement>(null)
	const p2Ref = useRef<HTMLParagraphElement>(null)
	const p3Ref = useRef<HTMLParagraphElement>(null)

	// 使用 useImperativeHandle 來暴露這些 refs
	useImperativeHandle(ref, () => ({
		textRef,
		p1Ref,
		p2Ref,
		p3Ref,
	}))

	return (
		<div style={{ background: 'red', height: '100' }}>
			<Modal
				title='Basic Modal'
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Typography.Text ref={textRef}>Some contents...</Typography.Text>
				<p ref={p1Ref}>Paragraph 1 contents...</p>
				<p ref={p2Ref}>Paragraph 2 contents...</p>
				<p ref={p3Ref}>Paragraph 3 contents...</p>
				<Button type='primary' onClick={showModal}>
					Open Modal
				</Button>
			</Modal>
		</div>
	)
})

export default ChildComponent
