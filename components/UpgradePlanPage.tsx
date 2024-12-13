'use client';
import { useEffect, useState } from 'react';

export function UpgradeConfirmedPage() {
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/upgrade-confirmed', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);

        if (data.success) {
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        }
      });
  });

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
      <div className='bg-white p-6 rounded shadow-md w-96'>
        <h2 className='text-2xl mb-4'>Upgrading Plan</h2>
        {message && <p className='mt-4 text-center'>{message}</p>}
      </div>
    </div>
  );
}
