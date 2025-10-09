"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Leaf } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [countryCode, setCountryCode] = useState("+91")
  const [mobileNumber, setMobileNumber] = useState("")
  const [cropType, setCropType] = useState("")
  const [season, setSeason] = useState("")

  const handleGetStarted = () => {
    if (mobileNumber.length === 10 && cropType && season) {
      // Store mobile number, crop, season and redirect to dashboard
      localStorage.setItem("userMobile", `${countryCode}${mobileNumber}`)
      localStorage.setItem("userCrop", cropType)
      localStorage.setItem("userSeason", season)
      router.push("/")
    } else {
      alert("Please enter a valid 10-digit mobile number, select crop type, and season")
    }
  }

  const handleContinueAsGuest = () => {
    localStorage.setItem("userMode", "guest")
    router.push("/")
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/farm-background.jpg" alt="Modern farm landscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo and Branding */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600">
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white">Kishan360</h1>
          <p className="text-lg text-gray-200">Your Smart Farming Assistant</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Welcome Back</h2>

          {/* Mobile Number Input */}
          <div className="mb-6">
            <label htmlFor="mobile" className="mb-2 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="flex gap-2">
              {/* Country Code Selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+86">+86</option>
              </select>

              {/* Mobile Number Input */}
              <input
                id="mobile"
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit number"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Crop Type Selection */}
          <div className="mb-6">
            <label htmlFor="crop" className="mb-2 block text-sm font-medium text-gray-700">
              Primary Crop Type
            </label>
            <select
              id="crop"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Crop</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
              <option value="cotton">Cotton</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="potato">Potato</option>
            </select>
          </div>

          {/* Season Selection */}
          <div className="mb-6">
            <label htmlFor="season" className="mb-2 block text-sm font-medium text-gray-700">
              Current Season
            </label>
            <select
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Season</option>
              <option value="kharif">Kharif (Monsoon)</option>
              <option value="rabi">Rabi (Winter)</option>
              <option value="zaid">Zaid (Summer)</option>
            </select>
          </div>

          {/* Get Started Button */}
          <button
            onClick={handleGetStarted}
            className="mb-4 w-full rounded-lg bg-green-600 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            Get Started
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or</span>
            </div>
          </div>

          {/* Continue as Guest */}
          <button
            onClick={handleContinueAsGuest}
            className="w-full rounded-lg border border-gray-300 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            Continue as Guest
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-300">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
