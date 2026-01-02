"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { verifyOTP, signInWithOTP } from "@/lib/supabase-auth"

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeSentAt, setCodeSentAt] = useState<number>(Date.now())
  const [timeRemaining, setTimeRemaining] = useState<number>(60)
  const router = useRouter()

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("otp_email")
    if (!storedEmail) {
      router.push("/admin/login")
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - codeSentAt) / 1000)
      const remaining = Math.max(0, 60 - elapsed)
      setTimeRemaining(remaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [codeSentAt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    setError(null)

    console.log('Verifying OTP:', { email: email.substring(0, 3) + '***', otpLength: otp.length, timeElapsed: Math.floor((Date.now() - codeSentAt) / 1000) })
    
    const { data, error } = await verifyOTP(email, otp)

    if (error) {
      console.error('OTP verification error:', error)
      const elapsed = Math.floor((Date.now() - codeSentAt) / 1000)
      if (error.message.toLowerCase().includes('expired') || 
          error.message.toLowerCase().includes('invalid')) {
        if (elapsed > 60) {
          setError("Code has expired. OTP codes are valid for 60 seconds. Please request a new code.")
        } else {
          setError(`Invalid code (${elapsed}s elapsed). Please check and try again. Error: ${error.message}`)
        }
      } else {
        setError(`Error: ${error.message}`)
      }
      setLoading(false)
    } else if (data.session) {
      console.log('OTP verified successfully')
      sessionStorage.removeItem("otp_email")
      router.push("/admin/dashboard")
      router.refresh()
    } else {
      console.warn('No session returned from OTP verification')
      setError("Verification failed. Please request a new code.")
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError(null)
    const { error } = await signInWithOTP(email)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setOtp("")
      setCodeSentAt(Date.now())
      setTimeRemaining(60)
      setError(null)
      setLoading(false)
      alert("A new code has been sent to your email")
    }
  }

  if (!email) {
    return null
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {email}. The code is valid for 60 seconds.
          <br />
          <span className="text-xs mt-2 block text-muted-foreground">
            Note: Check your email for a 6-digit numeric code (not a clickable link)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <InputOTP 
                maxLength={6} 
                id="otp" 
                required 
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={loading}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Enter the 6-digit code sent to your email.
                {timeRemaining > 0 ? (
                  <span className="block mt-1 font-medium text-primary">
                    Code expires in {timeRemaining}s
                  </span>
                ) : (
                  <span className="block mt-1 font-medium text-destructive">
                    Code expired - please request a new one
                  </span>
                )}
              </FieldDescription>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-muted-foreground mt-2">
                  Debug: Email = {email}, OTP Length = {otp.length}
                </p>
              )}
            </Field>
            {error && (
              <div className="p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer underline">Debug Info</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      Email: {email}
                      {'\n'}OTP Length: {otp.length}
                      {'\n'}Time Elapsed: {Math.floor((Date.now() - codeSentAt) / 1000)}s
                    </pre>
                  </details>
                )}
              </div>
            )}
            <FieldGroup>
              <Button type="submit" disabled={loading || timeRemaining === 0}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
              <FieldDescription className="text-center">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="underline hover:text-primary disabled:opacity-50"
                >
                  Resend
                </button>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
