"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Wrench,
  Briefcase,
} from "lucide-react";

interface Trade {
  id: string;
  name: string;
  slug: string;
  children?: Trade[];
}

type AccountType = "client" | "tradesperson" | null;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const preselectedType = searchParams.get("type") as AccountType;

  const [accountType, setAccountType] = useState<AccountType>(preselectedType);
  const [step, setStep] = useState(1);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [formData, setFormData] = useState({
    // Account
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Business (tradesperson only)
    businessName: "",
    phone: "",
    city: "",
    postcode: "",
    coverageRadius: "25",
    selectedTrades: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-select client type if coming from job post
  const isFromJobPost = callbackUrl?.includes("/jobs/post");
  useEffect(() => {
    if (isFromJobPost && !accountType) {
      setAccountType("client");
    }
  }, [isFromJobPost, accountType]);

  useEffect(() => {
    if (accountType === "tradesperson") {
      fetch("/api/trades")
        .then((res) => res.json())
        .then((data) => setTrades(data))
        .catch(console.error);
    }
  }, [accountType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTrade = (tradeId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTrades: prev.selectedTrades.includes(tradeId)
        ? prev.selectedTrades.filter((id) => id !== tradeId)
        : [...prev.selectedTrades, tradeId],
    }));
  };

  const validateStep = (currentStep: number) => {
    setError("");

    if (currentStep === 1) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all fields");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }
    }

    if (currentStep === 2 && accountType === "tradesperson") {
      if (
        !formData.businessName ||
        !formData.phone ||
        !formData.city ||
        !formData.postcode
      ) {
        setError("Please fill in all fields");
        return false;
      }
    }

    if (currentStep === 3 && accountType === "tradesperson") {
      if (formData.selectedTrades.length === 0) {
        setError("Please select at least one trade");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (accountType === "client") {
      if (!validateStep(1)) return;
    } else {
      if (!validateStep(3)) return;
    }

    setIsLoading(true);
    setError("");

    try {
      const endpoint =
        accountType === "tradesperson"
          ? "/api/auth/register/tradesperson"
          : "/api/auth/register";

      const body =
        accountType === "tradesperson"
          ? formData
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              role: "CUSTOMER",
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        const loginUrl = callbackUrl
          ? `/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "/login?registered=true";
        router.push(loginUrl);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md w-full text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {accountType === "tradesperson"
            ? "Welcome to Builder!"
            : "Account created!"}
        </h1>
        <p className="text-slate-600">Redirecting you to login...</p>
      </div>
    );
  }

  // Step 0: Account Type Selection
  if (!accountType) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Join Builder</h1>
          <p className="mt-2 text-slate-600">How would you like to use Builder?</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => setAccountType("client")}
            className="w-full p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  I need work done
                </h3>
                <p className="text-slate-600 text-sm">
                  Find trusted tradespeople, post jobs, and get quotes for your project
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 mt-1" />
            </div>
          </button>

          <button
            onClick={() => setAccountType("tradesperson")}
            className="w-full p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-secondary-500 hover:bg-secondary-50 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                <Wrench className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  I&apos;m a tradesperson
                </h3>
                <p className="text-slate-600 text-sm">
                  Create your profile, showcase your work, and get leads from local customers
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-secondary-600 mt-1" />
            </div>
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href={
                callbackUrl
                  ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : "/login"
              }
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Client Registration Form (simple)
  if (accountType === "client") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-slate-600">
            Find trusted tradespeople for your project
          </p>
        </div>

        {isFromJobPost && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <p className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Create an account to post your job
            </p>
            <p className="text-sm mt-1">
              Sign up for free to post your job and receive quotes from local
              tradespeople.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="John Smith"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAccountType(null)}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href={
                  callbackUrl
                    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                    : "/login"
                }
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tradesperson Registration Form (multi-step)
  const totalSteps = 3;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Join as a Tradesperson</h1>
        <p className="mt-2 text-slate-600">
          Create your profile and start getting leads
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold " +
                (step >= s
                  ? "bg-secondary-600 text-white"
                  : "bg-slate-200 text-slate-500")
              }
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={
                  "w-12 sm:w-16 h-1 mx-2 " +
                  (step > s ? "bg-secondary-600" : "bg-slate-200")
                }
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Account Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType(null)}
                  className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 px-4 bg-secondary-600 text-white font-medium rounded-lg hover:bg-secondary-700 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Business Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="Smith Plumbing Services"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="07123 456789"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City/Town
                  </label>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="Manchester"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Postcode
                  </label>
                  <input
                    name="postcode"
                    type="text"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    placeholder="M1 1AA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Coverage radius (miles)
                </label>
                <select
                  name="coverageRadius"
                  value={formData.coverageRadius}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="5">5 miles</option>
                  <option value="10">10 miles</option>
                  <option value="25">25 miles</option>
                  <option value="50">50 miles</option>
                  <option value="100">100 miles</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 px-4 bg-secondary-600 text-white font-medium rounded-lg hover:bg-secondary-700 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select Trades */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Select Your Trades
              </h2>
              <p className="text-sm text-slate-600">
                Choose all the trades you offer
              </p>

              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-4">
                {trades.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <p className="font-medium text-slate-900 text-sm">
                      {category.name}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      {category.children?.map((trade) => (
                        <label
                          key={trade.id}
                          className={
                            "flex items-center gap-2 p-2 rounded-lg cursor-pointer border " +
                            (formData.selectedTrades.includes(trade.id)
                              ? "border-secondary-500 bg-secondary-50"
                              : "border-slate-200 hover:border-slate-300")
                          }
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedTrades.includes(trade.id)}
                            onChange={() => toggleTrade(trade.id)}
                            className="w-4 h-4 text-secondary-600 rounded focus:ring-secondary-500"
                          />
                          <span className="text-sm text-slate-700">
                            {trade.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-500">
                Selected: {formData.selectedTrades.length} trade(s)
              </p>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-secondary-600 text-white font-medium rounded-lg hover:bg-secondary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mt-6 text-xs text-slate-500 text-center">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-pulse">
              <div className="h-96 bg-slate-100 rounded"></div>
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
