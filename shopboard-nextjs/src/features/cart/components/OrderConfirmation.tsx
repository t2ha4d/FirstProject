'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { formatPrice } from '../../../shared/lib/format'
import { Icon } from '../../../shared/ui/Icon'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { parseStoredOrder, readStoredOrder, subscribeToOrder } from '../orderStorage'

/** The server cannot know the saved order; `undefined` means the browser has not been asked yet. */
function readNothingOnServer(): undefined {
  return undefined
}

/**
 * The order saved by checkout. Opened directly there is no order, so it says so instead of
 * redirecting or inventing a confirmation.
 */
export function OrderConfirmation() {
  const raw = useSyncExternalStore<string | null | undefined>(
    subscribeToOrder,
    readStoredOrder,
    readNothingOnServer,
  )

  if (raw === undefined) return null

  const order = parseStoredOrder(raw)

  if (order === null) {
    return (
      <StatePanel
        art={<Icon name="box" size={36} />}
        title="No recent order"
        description="When you place an order, its confirmation will show here."
        heading="h1"
      >
        <Link href="/shop" className="retry-btn">
          Browse the shop
        </Link>
      </StatePanel>
    )
  }

  const { customerName, email, items, subtotalCents } = order

  return (
    <section className="order-summary order-confirmation" aria-labelledby="confirmation-title">
      <h1 id="confirmation-title" className="order-summary-title">
        Thank you for your order, {customerName}
      </h1>
      <p className="order-confirmation-text">We will contact you at {email} about delivery.</p>
      <ul className="order-summary-list">
        {items.map(({ id, title, quantity, lineTotalCents }) => (
          <li key={id} className="order-summary-item">
            <span>
              {title} × {quantity}
            </span>
            <span>{formatPrice(lineTotalCents)}</span>
          </li>
        ))}
      </ul>
      <div className="subtotal-row">
        <span className="subtotal-label">Total</span>
        <span className="subtotal-amount">{formatPrice(subtotalCents)}</span>
      </div>
      <Link href="/shop" className="retry-btn order-confirmation-action">
        Continue shopping
      </Link>
    </section>
  )
}
