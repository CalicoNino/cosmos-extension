import classNames from 'classnames'
import { motion } from 'framer-motion'
import React from 'react'
import { Colors } from 'theme/colors'

export function SwapFailureIcon({
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
      <path
        d='M59.2937 21.0585C61.8362 18.3257 66.1638 18.3257 68.7063 21.0585C70.5928 23.0862 73.5661 23.6776 76.085 22.5262C79.4797 20.9744 83.4779 22.6305 84.781 26.1282C85.748 28.7236 88.2686 30.4078 91.0364 30.3079C94.7665 30.1734 97.8266 33.2335 97.6921 36.9636C97.5922 39.7314 99.2764 42.252 101.872 43.219C105.369 44.5221 107.026 48.5203 105.474 51.915C104.322 54.4339 104.914 57.4072 106.942 59.2937C109.674 61.8362 109.674 66.1638 106.942 68.7063C104.914 70.5928 104.322 73.5661 105.474 76.085C107.026 79.4797 105.369 83.4779 101.872 84.781C99.2764 85.748 97.5922 88.2686 97.6921 91.0364C97.8266 94.7665 94.7665 97.8266 91.0364 97.6921C88.2686 97.5922 85.748 99.2764 84.781 101.872C83.4779 105.369 79.4797 107.026 76.085 105.474C73.5661 104.322 70.5928 104.914 68.7063 106.942C66.1638 109.674 61.8362 109.674 59.2937 106.942C57.4072 104.914 54.4339 104.322 51.915 105.474C48.5203 107.026 44.5221 105.369 43.219 101.872C42.252 99.2764 39.7314 97.5922 36.9636 97.6921C33.2335 97.8266 30.1734 94.7665 30.3079 91.0364C30.4078 88.2686 28.7236 85.748 26.1282 84.781C22.6305 83.4779 20.9744 79.4797 22.5262 76.085C23.6776 73.5661 23.0862 70.5928 21.0585 68.7063C18.3257 66.1638 18.3257 61.8362 21.0585 59.2937C23.0862 57.4072 23.6776 54.4339 22.5262 51.915C20.9744 48.5203 22.6305 44.5221 26.1282 43.219C28.7236 42.252 30.4078 39.7314 30.3079 36.9636C30.1734 33.2335 33.2335 30.1734 36.9636 30.3079C39.7314 30.4078 42.252 28.7236 43.219 26.1282C44.5221 22.6305 48.5203 20.9744 51.915 22.5262C54.4339 23.6776 57.4072 23.0862 59.2937 21.0585Z'
        fill={Colors.red400}
      />
      <motion.path
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.25,
          delay: 0.1,
        }}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M64 37C66.2091 37 68 38.7909 68 41L68 71C68 73.2091 66.2091 75 64 75C61.7909 75 60 73.2091 60 71L60 41C60 38.7909 61.7909 37 64 37Z'
        fill={Colors.white100}
      />
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.25,
          delay: 0.1,
        }}
        cx='64'
        cy='87'
        r='4'
        fill={Colors.white100}
      />
    </motion.svg>
  )
}