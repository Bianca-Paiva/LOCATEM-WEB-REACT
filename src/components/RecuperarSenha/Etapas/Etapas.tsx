import styles from './Etapas.module.css';
import checkIcon from '../../../assets/checkIcon.png';

interface RecoveryStepperProps {
    currentStep: 1 | 2 | 3
}

const steps = [
    { id: 1, label: 'E-mail' },
    { id: 2, label: 'Validação' },
    { id: 3, label: 'Nova Senha' }
]

export default function RecoveryStepper({ currentStep }: RecoveryStepperProps) {
    return (
        <div className={styles.stepper}>
            {steps.map((step, index) => {
                const isCompleted = step.id < currentStep
                const isCurrent = step.id === currentStep

                return (
                    <div key={step.id} className={styles.stepContainer}>
                        <div className={styles.stepContent}>
                            
                            {/* Círculo da Etapa */}
                            <div
                                className={`
                                    ${styles.step}
                                    ${isCurrent ? styles.current : ''}
                                    ${isCompleted ? styles.completed : ''}
                                `}
                            >
                                {step.id}
                            </div>

                            {/* Container da Palavra e do Check em Imagem */}
                            <div className={styles.labelContainer}>
                                <span
                                    className={`
                                        ${styles.label}
                                        ${isCurrent ? styles.activeLabel : ''}
                                    `}
                                >
                                    {step.label}
                                </span>
                                
                                {isCompleted && (
                                    <img 
                                        src={checkIcon}
                                        alt="Concluído" 
                                        className={styles.checkImage} 
                                    />
                                )}
                            </div>
                        </div>

                        {/* Linha (oculta no último item) */}
                        {index < steps.length - 1 && (
                            <div className={styles.line} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}