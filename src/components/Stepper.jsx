import React, { useState, Children, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  allowNext = true, // new: external validation gate
  onNextAttempt = () => {}, // new: called when next is blocked
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Précédent',
  nextButtonText = 'Suivant',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-0" {...rest}>
      <div className={`mx-auto w-full rounded-2xl ${stepCircleContainerClassName}`}>
        <div className={`${stepContainerClassName} flex w-full items-center p-4 sm:p-6`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-4 sm:px-6 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-4 sm:px-6 pb-4 sm:pb-6 ${footerClassName}`}>
            <div className={`mt-6 flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
              {currentStep !== 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-lg text-sm ring-1 ring-white/15 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!allowNext) { onNextAttempt(); return; }
                  return isLastStep ? handleComplete() : handleNext();
                }}
                className="flex items-center justify-center rounded-lg bg-green-300 text-green-900 py-2 px-4 text-sm font-medium tracking-tight transition hover:bg-green-200"
                {...nextButtonProps}
              >
                {isLastStep ? 'Terminer' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className = '' }) {
  const [parentHeight, setParentHeight] = useState(0);
  return (
    <motion.div
      // Clip slide animations to the panel while keeping enough inner padding for focus rings
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight + 10 }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  // Observe dynamic resizes inside the step (e.g., textarea drag)
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      onHeightReady(el.offsetHeight);
    });
    ro.observe(el);
    // Also listen to window resize for safety
    const onWin = () => onHeightReady(el.offsetHeight);
    window.addEventListener('resize', onWin);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onWin);
    };
  }, [onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {/* Inner padding to prevent input rings/shadows from being clipped by the outer mask */}
      <div className="pt-1 pb-3">{children}</div>
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir) => ({ x: dir >= 0 ? '50%' : '-50%', opacity: 0 }),
};

export function Step({ children }) {
  return <div className="px-0 sm:px-2">{children}</div>;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators = false }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };
  return (
    <motion.div onClick={handleClick} className="relative cursor-pointer outline-none" animate={status} initial={false}>
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: 'rgba(255,255,255,0.06)', color: '#a3a3a3' },
          active: { scale: 1, backgroundColor: 'rgba(64,255,170,0.35)', color: '#40ffaa' },
          complete: { scale: 1, backgroundColor: 'rgba(64,255,170,0.9)', color: '#052e23' },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
      >
        {status === 'complete' ? (
          <CheckIcon className="h-4 w-4 text-green-900" />
        ) : status === 'active' ? (
          <div className="h-3 w-3 rounded-full bg-[#071019]" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: 'transparent' },
    complete: { width: '100%', backgroundColor: 'rgba(64,255,170,0.8)' },
  };
  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-white/10">
      <motion.div className="absolute left-0 top-0 h-full" variants={lineVariants} initial={false} animate={isComplete ? 'complete' : 'incomplete'} transition={{ duration: 0.4 }} />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
