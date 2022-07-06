import { FC } from 'react'
import { FormProvider } from 'common/context'

interface EditableRowProps {
	index: number
}

const EditableRow: FC<EditableRowProps> = ({ index, ...props }) => {
	return (
		<FormProvider>
			<tr {...props} />
		</FormProvider>
	)
}

export { EditableRow }
