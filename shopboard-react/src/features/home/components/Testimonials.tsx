import type { Testimonial } from '../types'

export interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <h2 id="testimonials-title" className="section-title">
        Worn and Loved
      </h2>
      <ul className="testimonial-list">
        {testimonials.map(({ id, quote, author }) => (
          <li key={id} className="testimonial">
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote className="testimonial-quote">{quote}</blockquote>
            <p className="testimonial-stars" role="img" aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <p className="testimonial-author">— {author}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
