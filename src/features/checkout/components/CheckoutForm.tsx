import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { CHECKOUT_FIELDS, EMPTY_CHECKOUT } from '../fields'
import { checkoutSchema } from '../schema'
import type { CheckoutValues } from '../types'

export interface CheckoutFormProps {
  onSubmit: (values: CheckoutValues) => void
}

/**
 * Shipping details. Validation runs on submit and then again as the customer fixes
 * a field; react-hook-form moves focus to the first invalid field and keeps every value.
 */
export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(checkoutSchema), defaultValues: EMPTY_CHECKOUT })

  return (
    <form
      className="checkout-form grid gap-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="checkout-form-title"
    >
      <h2 id="checkout-form-title" className="order-summary-title">
        Shipping details
      </h2>

      {CHECKOUT_FIELDS.map(({ name, label, type, autoComplete }) => {
        const message = errors[name]?.message
        const errorId = `${name}-error`
        return (
          <div key={name} className="grid gap-1.5">
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              type={type}
              autoComplete={autoComplete}
              aria-invalid={message !== undefined}
              aria-describedby={message !== undefined ? errorId : undefined}
              className="h-11 rounded-sm bg-white"
              {...register(name)}
            />
            {message !== undefined && (
              <p id={errorId} className="m-0 text-sm text-destructive">
                {message}
              </p>
            )}
          </div>
        )
      })}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-12 rounded-sm border-0 text-xs tracking-[0.14em] uppercase"
      >
        {isSubmitting ? 'Placing order…' : 'Place order'}
      </Button>
    </form>
  )
}
