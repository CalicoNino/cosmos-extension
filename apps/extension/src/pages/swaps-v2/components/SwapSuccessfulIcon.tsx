import classNames from 'classnames'
import { motion } from 'framer-motion'
import React from 'react'
import { Colors } from 'theme/colors'

export function SwapSuccessfulIcon({
  className,
  size = '128',
}: {
  className?: string
  size?: string
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox='0 0 128 128'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={classNames('relative', className)}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.25,
      }}
    >
      <motion.path
        className='animate-[spin_9s_linear_infinite] origin-center'
        d='M59.2937 21.0585C61.8362 18.3257 66.1638 18.3257 68.7063 21.0585C70.5928 23.0862 73.5661 23.6776 76.085 22.5262C79.4797 20.9744 83.4779 22.6305 84.781 26.1282C85.748 28.7236 88.2686 30.4078 91.0364 30.3079C94.7665 30.1734 97.8266 33.2335 97.6921 36.9636C97.5922 39.7314 99.2764 42.252 101.872 43.219C105.369 44.5221 107.026 48.5203 105.474 51.915C104.322 54.4339 104.914 57.4072 106.942 59.2937C109.674 61.8362 109.674 66.1638 106.942 68.7063C104.914 70.5928 104.322 73.5661 105.474 76.085C107.026 79.4797 105.369 83.4779 101.872 84.781C99.2764 85.748 97.5922 88.2686 97.6921 91.0364C97.8266 94.7665 94.7665 97.8266 91.0364 97.6921C88.2686 97.5922 85.748 99.2764 84.781 101.872C83.4779 105.369 79.4797 107.026 76.085 105.474C73.5661 104.322 70.5928 104.914 68.7063 106.942C66.1638 109.674 61.8362 109.674 59.2937 106.942C57.4072 104.914 54.4339 104.322 51.915 105.474C48.5203 107.026 44.5221 105.369 43.219 101.872C42.252 99.2764 39.7314 97.5922 36.9636 97.6921C33.2335 97.8266 30.1734 94.7665 30.3079 91.0364C30.4078 88.2686 28.7236 85.748 26.1282 84.781C22.6305 83.4779 20.9744 79.4797 22.5262 76.085C23.6776 73.5661 23.0862 70.5928 21.0585 68.7063C18.3257 66.1638 18.3257 61.8362 21.0585 59.2937C23.0862 57.4072 23.6776 54.4339 22.5262 51.915C20.9744 48.5203 22.6305 44.5221 26.1282 43.219C28.7236 42.252 30.4078 39.7314 30.3079 36.9636C30.1734 33.2335 33.2335 30.1734 36.9636 30.3079C39.7314 30.4078 42.252 28.7236 43.219 26.1282C44.5221 22.6305 48.5203 20.9744 51.915 22.5262C54.4339 23.6776 57.4072 23.0862 59.2937 21.0585Z'
        fill={Colors.green600}
      />
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.25,
          delay: 0.1,
        }}
        d='M47.6938 62.518L57.5694 72.6689L80.3062 49.2984C81.1483 48.4328 82.2201 48 83.5215 48C84.823 48 85.8947 48.4328 86.7368 49.2984C87.5789 50.1639 88 51.2656 88 52.6033C88 53.941 87.5789 55.0426 86.7368 55.9082L60.7847 82.5836C59.866 83.5279 58.7943 84 57.5694 84C56.3445 84 55.2727 83.5279 54.3541 82.5836L41.2632 69.1279C40.4211 68.2623 40 67.1607 40 65.823C40 64.4852 40.4211 63.3836 41.2632 62.518C42.1053 61.6525 43.177 61.2197 44.4785 61.2197C45.7799 61.2197 46.8517 61.6525 47.6938 62.518Z'
        fill={Colors.white100}
      />
    </motion.svg>
  )
}
