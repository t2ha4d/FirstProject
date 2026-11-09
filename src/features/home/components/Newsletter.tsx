import { useState } from 'react'
import type { FormEvent } from 'react'

export interface NewsletterProps {
  onSubscribe?: (email: string) => void
}

export function Newsletter({ onSubscribe }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubscribe?.(email)
    setIsSubmitted(true)
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter-inner">
        <div>
          <h2 id="newsletter-title" className="newsletter-title">
            Let’s stay in touch
          </h2>
          <p className="newsletter-text">
            Be the first to know about new releases, limited editions, and special offers.
          </p>
        </div>

        {isSubmitted ? (
          <p className="newsletter-thanks" role="status">
            Thank you for subscribing.
          </p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className="visually-hidden">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email address"
              className="newsletter-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button
              type="submit"
              className="newsletter-btn"
              aria-label="Subscribe to the newsletter"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
