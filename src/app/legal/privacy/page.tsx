"use client";

import React from 'react';

export default function PrivacyPolicyPage() {
  // A data estática é mais apropriada para um documento legal.
  const lastUpdated = "10 de Agosto de 2025";

  return (
    <>
      <h1>Privacy Policy for The Wealth Map</h1>
      <p><strong>Last Updated:</strong> {lastUpdated}</p>

      <p>
        At The Wealth Map, your privacy is our top priority. This Privacy Policy describes how we handle your information, ensuring complete transparency and control over your data.
      </p>

      <h2>1. Core Principle: Your Data, Your Control</h2>
      <p>
        The Wealth Map is designed with a privacy-first approach. We do not collect, store, transmit, or gain access to any of your personal or financial data. All information remains entirely under your control.
      </p>

      <h2>2. Local Data Storage</h2>
      <p>
        All data you enter—such as your name, financial goals, transactions, reflections, and wealth wheel assessments—is stored exclusively on your device (phone, computer, or tablet) using secure local storage technology.
      </p>
      <ul>
        <li>Your data never leaves your device.</li>
        <li>We, as developers of The Wealth Map, have no visibility or access to your information.</li>
        <li>If you clear your device's data or uninstall the app, your information will be permanently erased and cannot be recovered.</li>
      </ul>

      <h2>3. AI Features</h2>
      <p>
        The AI Coach and Chatbot features process your data solely to provide personalized insights. This processing occurs locally on your device or is transmitted anonymously and temporarily to a trusted generative AI service.
      </p>
      <ul>
          <li>The data is used only for generating your requested response.</li>
          <li>It is not stored, logged, or used to train any AI models.</li>
      </ul>

      <h2>4. No Accounts, No Servers</h2>
      <p>The Wealth Map is a self-contained application:</p>
       <ul>
          <li>No registration or login is required.</li>
          <li>We do not operate servers or cloud databases for storing your data.</li>
          <li>This ensures maximum privacy and eliminates risks of data breaches.</li>
      </ul>


      <h2>5. Updates to This Policy</h2>
      <p>
        We may revise this Privacy Policy periodically to reflect improvements in our practices or legal requirements. Any updates will be posted on this page, and the “Last Updated” date will be adjusted accordingly.
      </p>
       <p>
        We encourage you to review this policy occasionally to stay informed about how we protect your data.
      </p>


      <h2>6. Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy, you may reach us at:
      </p>
      <ul>
        <li>📧 Email: thewealthmap.app@gmail.com</li>
        <li>📞 Phone: +238 520 16 61</li>
      </ul>
    </>
  )
}
