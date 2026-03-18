import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/config/firebase"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Activity, Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const googleProvider = new GoogleAuthProvider()

const DEMO_USER = {
  uid: "demo-user",
  email: "demo@healthcare.com",
  displayName: "Demo User",
  photoURL: null,
}

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setLoading, isLoading } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDemoLogin = () => {
    setUser(DEMO_USER)
    toast.success("Welcome, Demo User!")
    navigate("/dashboard")
  }

  const handleEmailLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    // Demo credentials shortcut
    if (email === "demo@healthcare.com" && password === "demo123") {
      handleDemoLogin()
      return
    }

    if (!auth) {
      toast.error("Firebase is not configured. Use demo login instead.")
      return
    }

    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser({ uid: result.user.uid, email: result.user.email, displayName: result.user.displayName })
      toast.success("Welcome back!")
      navigate("/dashboard")
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Invalid email or password")
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later.")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error("Firebase is not configured. Use demo login instead.")
      return
    }
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser({ uid: result.user.uid, email: result.user.email, displayName: result.user.displayName })
      toast.success(`Welcome, ${result.user.displayName ?? "there"}!`)
      navigate("/dashboard")
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return
      toast.error("Google sign-in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">HealthCare</span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Access your healthcare dashboard</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or sign in with email</span>
              <Separator className="flex-1" />
            </div>

            {/* Email/Password form */}
            <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
                  }}
                  className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
                    }}
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            {/* Demo login */}
            <Button
              variant="outline"
              className="w-full border-dashed text-muted-foreground hover:text-foreground"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Continue as Demo User
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo credentials: <span className="font-mono">demo@healthcare.com</span> / <span className="font-mono">demo123</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
