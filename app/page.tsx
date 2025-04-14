"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, PieChart, TrendingUp, Lock } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "@/animations/landing-animation.json"; // Placeholder: Add your Lottie JSON file
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Take Control with{" "}
            <span className="text-blue-600">Little Accountant</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Simplify your finances, track expenses, and plan for the
            future with an app that’s as smart as you are.
          </p>
          {isMounted && (
            <div className="w-64 h-64 md:w-80 md:h-80">
              <Lottie animationData={animationData} loop={true} />
            </div>
          )}
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg"
            asChild
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose Little Accountant?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <DollarSign className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle>Expense Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Categorize and monitor every penny with real-time
                insights into your spending habits.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <PieChart className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle>Budget Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create personalized budgets that help you save more
                and stress less.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle>Financial Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Set and track your financial dreams, from vacations to
                investments.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-16 bg-blue-50 rounded-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <p className="text-gray-600 italic">
                “Little Accountant made budgeting so easy! I finally
                feel in control of my money.”
              </p>
              <p className="mt-4 font-semibold">— Sarah M.</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <p className="text-gray-600 italic">
                “The insights are incredible. I saved hundreds just by
                tracking my expenses.”
              </p>
              <p className="mt-4 font-semibold">— James T.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Lock className="w-12 h-12 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Bank-Grade Security
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your data is protected with industry-leading encryption,
          ensuring your financial information stays safe and private.
        </p>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-blue-600 text-white rounded-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Master Your Finances?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Join thousands of users who trust Little Accountant to
          simplify their financial lives.
        </p>
        <Button
          size="lg"
          variant="outline"
          className="border-white text-black hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full text-lg"
          asChild
        >
          <Link href="/register">Get Started Now</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2025 Little Accountant. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="/privacy" className="hover:text-blue-600">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-blue-600">
            Terms of Service
          </a>
          <a href="/contact" className="hover:text-blue-600">
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  );
}
