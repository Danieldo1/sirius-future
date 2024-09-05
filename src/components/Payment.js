'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import InputMask from 'react-input-mask'
import { motion } from 'framer-motion'

export default function Payment({ onPaymentSuccess }) {
  const [cardData, setCardData] = useState({
    number: '',
    expiration: '',
    cvv: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { data: session } = useSession()

  const handleChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value })
  }

  const validateExpiration = () => {
    const [month, year] = cardData.expiration.split('/')
    const expirationDate = new Date(20 + year, month - 1) 
    const today = new Date()
    return expirationDate > today
  }


  const validateCard = () => {
    let sum = 0
    let isEven = false
    for (let i = cardData.number.replace(/\D/g, '').length - 1; i >= 0; i--) {
      let digit = parseInt(cardData.number.replace(/\D/g, '').charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!session) {
      toast.error('You must be logged in to make a payment')
      return
    }

    if (!validateExpiration()) {
      toast.error('Card has expired, please enter a future date')
      return
    }

    if (!validateCard()) {
      toast.error('Invalid card number, please enter a test card ONLY!')
      return
    }

    setIsProcessing(true)

    const [expirationMonth, expirationYear] = cardData.expiration.split('/')

    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: cardData.number.replace(/\D/g, ''),
          expirationMonth,
          expirationYear: `20${expirationYear}`,
          cvv: cardData.cvv,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        if (onPaymentSuccess) {
          onPaymentSuccess()
        }
      } else {
        const data = await response.json()
        toast.error(data.error || 'Payment failed')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">Card Number</label>
          <InputMask
            mask="9999 9999 9999 9999"
            maskChar={null}
            type="text"
            id="number"
            name="number"
            value={cardData.number}
            onChange={handleChange}
            required
            className="mt-1 block border-2 w-3/4  md:w-1/2 h-9 rounded-md border-gray-800 shadow-sm focus:border-indigo-100 focus:black focus:ring-indigo-200 focus:ring-opacity-10"
            placeholder="xxxx xxxx xxxx xxxx"
          />
          <p className="mt-1 text-sm text-gray-500 select-none">Тестовая карта: 4111 1111 1111 1111</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">Expiration Date</label>
            <InputMask
              mask="99/99"
              maskChar={null}
              type="text"
              id="expiration"
              name="expiration"
              value={cardData.expiration}
              onChange={handleChange}
              required
              className="mt-1 block w-3/4 md:w-1/2 h-9 border-2 border-gray-800 rounded-md  shadow-sm focus:border-indigo-100 focus:black focus:ring-indigo-200 focus:ring-opacity-10"
              placeholder="MM/YY"
            />
            <p className="mt-1 text-sm text-gray-500 select-none">Любую будушую дату</p>
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
            <InputMask
              mask="999"
              maskChar={null}
              type="text"
              id="cvv"
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              required
              className="mt-1 block  w-3/4  md:w-1/2 h-9 border-2 border-gray-800 rounded-md  shadow-sm focus:border-indigo-100 focus:black focus:ring-indigo-200 focus:ring-opacity-10"
              placeholder="xxx"
            />
            <p className="mt-1 text-sm text-gray-500 select-none">3 цифры любые</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          type="submit"
          disabled={isProcessing}
          className={`w-full bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </motion.button>
      </form>
    </div>
  )
}