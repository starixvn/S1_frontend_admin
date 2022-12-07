import { message } from 'antd'
import copy from 'copy-to-clipboard'
import { useTranslation } from 'react-i18next'

const useCopy = () => {
	const { t } = useTranslation()
	const onCopy = async (value: string) => {
		if (copy(value)) {
			message.success(`${t('Label_Copied')} ${t('System.Label_Success')}`)
		} else {
			message.error(t('Label_TryAgain'))
		}
	}

	return { onCopy }
}

export { useCopy }
