import { useEffect, useRef, useState } from 'react'

/* Devuelve un ref para asociar al elemento y un booleano `inView`
   que indica si está visible en el viewport según el threshold. */
export default function useInView({ threshold = 0.6, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, inView }
}
