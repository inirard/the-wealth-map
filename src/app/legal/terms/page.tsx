"use client";

import React, { useState, useEffect } from 'react';

export default function TermsOfServicePage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // This code runs only on the client, after the page has hydrated.
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <>
      <h1>Terms of Service for The Wealth Map</h1>
      <p><strong>Last Updated:</strong> {lastUpdated}</p>

      <p>
        By purchasing, downloading, or using "The Wealth Map" (the "Service"), you agree to the following Terms of Service.
      </p>

      <h2>1. License of Use</h2>
      <p>
        You are granted a personal, limited, non-exclusive, and non-transferable license to use The Wealth Map for your own financial planning purposes. Commercial use, redistribution, or modification of the Service is strictly prohibited without prior written consent.
      </p>

      <h2>2. Data Storage and Responsibility</h2>
      <p>
        All data entered into the Service is stored solely on your local device. The developers of The Wealth Map do not collect, access, or back up your data. You are solely responsible for securing and backing up your device and data.
      </p>

      <h2>3. Future Updates</h2>
      <p>
        Future updates of The Wealth Map may introduce optional paid features, subscriptions, or online services. These will be subject to separate terms and conditions, which you must review and accept before use.
      </p>

      <h2>4. Refund Policy</h2>
      <p>
        Due to the digital nature of this product, all sales are final. Refunds are not provided once the application is downloaded, except where required by applicable law.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content, design elements, graphics, and code within The Wealth Map are the intellectual property of its developers. You may not copy, reverse-engineer, or distribute any part of the Service without written permission.
      </p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is" and "as available" without any express or implied warranties. All financial decisions made using this Service are entirely your responsibility.
      </p>
      
      <h2>7. Limitation of Liability</h2>
      <p>
        In no event shall The Wealth Map or its developers be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use or inability to use the Service.
      </p>
      
      <h2>8. Governing Law</h2>
      <p>
        These Terms are governed by the laws of Cabo Verde, without regard to conflict of law principles.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Updates will be posted within the app or on our official website.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For any questions regarding these Terms, contact us at:
      </p>
      <ul>
        <li><strong>Email:</strong> thewealthmap.app@gmail.com</li>
        <li><strong>Phone:</strong> +238 520 16 61</li>
      </ul>
    </>
  )
}
