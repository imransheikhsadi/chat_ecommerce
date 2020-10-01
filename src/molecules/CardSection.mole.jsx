import React from 'react'
import { CardElement } from '@stripe/react-stripe-js'

const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true
  };

export default function CardSection() {
    return (
        <div>
            <label>
                Card Details
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </label>
        </div>
    )
}
