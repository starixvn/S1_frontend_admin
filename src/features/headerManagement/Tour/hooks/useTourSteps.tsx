import { useTranslation } from 'react-i18next'
import { TourProps } from 'antd'

interface IStepConfig {
	selector: string
	title: string
	description: string
	cover: string | null
}

const useGenerateTourSteps = (tourSteps: IStepConfig[]): TourProps['steps'] => {
	const { t } = useTranslation()

	// 使用data屬性 格式data-feature-tour 如header management 縮寫為 hm
	const getTourTarget = (selector: string) =>
		document.querySelector(`[data-hm-tour="${selector}"]`) as HTMLElement

	// 使用StepConfig 統一管理 搭配mapping產生 antd要的Tour Steps

	const steps = tourSteps.map(step => ({
		target: () => getTourTarget(step.selector),
		title: t(step.title),
		description: t(step.description),
		cover: step.cover && <img src={step.cover} alt={t(step.title)} />,
	}))

	return steps
}

export default useGenerateTourSteps
