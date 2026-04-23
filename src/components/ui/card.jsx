export function Card({ className = '', ...props }) {
  return <div className={`bg-white border ${className}`.trim()} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={className} {...props} />
}
