import { Suspense, memo } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const SplineRobot = memo(() => {
  return (
    <div className="w-full h-full relative">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
            />
          </div>
        }
      >
        <Spline 
          scene="https://prod.spline.design/sjQfmUyh7zfIY0jk/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
});

SplineRobot.displayName = 'SplineRobot';

export default SplineRobot;
