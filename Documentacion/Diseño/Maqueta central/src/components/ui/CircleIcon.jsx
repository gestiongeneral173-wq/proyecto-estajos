const SIZES = {
  sm: { box: 'w-8  h-8',  ico: 'w-4 h-4' },
  md: { box: 'w-10 h-10', ico: 'w-5 h-5' },
  lg: { box: 'w-12 h-12', ico: 'w-7 h-7' },
  xl: { box: 'w-24 h-24', ico: 'w-12 h-12' }
}

export default function CircleIcon({ icon: Icon, size = 'md', shape = 'circle', className = '' }) {
  const { box, ico } = SIZES[size]
  const radius = shape === 'square' ? 'rounded-2xl' : 'rounded-full'

  return (
    <div className={`${box} bg-navy-dark ${radius} flex items-center justify-center flex-shrink-0 ${className}`}>
      <Icon className={`${ico} text-gold`} />
    </div>
  )
}
