"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Payment from "@/components/Payment";
import Image from "next/image";
import SavedPaymentMethod from "@/components/SavedPaymentMethod";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [lessons, setLessons] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [savedPaymentMethod, setSavedPaymentMethod] = useState(null)
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
        fetchLessons()
        fetchPaymentMethod()
    }
  }, [status, router]);

  const fetchLessons = async () => {
    const response = await fetch("/api/lessons");
    if (response.ok) {
      const data = await response.json();
      setLessons(data.lessons);
    }
  };

  const fetchPaymentMethod = async () => {
    const response = await fetch('/api/payment-method')
    if (response.ok) {
      const data = await response.json()
      setSavedPaymentMethod(data.paymentMethod)
    }
  }

  const handlePaymentSuccess = (purchaseData) => {
    fetchLessons()
    setSavedPaymentMethod(purchaseData.paymentMethod)
    setShowPayment(false)
  }

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-20"><Loader2 className="animate-spin mx-auto" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    
    <SavedPaymentMethod paymentMethod={savedPaymentMethod} />

    <div className="bg-white p-6 rounded shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Lessons</h2>
        <button 
          onClick={() => setShowPayment(!showPayment)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
        >
          {showPayment ? 'Hide Payment' : 'Buy More Lessons'}
        </button>
      </div>
      {showPayment && (
      <div className="my-6 border-[1px] border-gray-200 p-4 rounded-md">
        <Payment onPaymentSuccess={handlePaymentSuccess} />
      </div>
    )}
      
      {lessons.length > 0 ? (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => (
            <li key={index} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{lesson.title}</h3>
              <div className="mt-2 mb-4 flex justify-center">
                <Image
                  src="/lesson.png"
                  width={200}
                  height={200}
                  alt={lesson.title}
                />
              </div>
              <p className="text-gray-600">
                {lesson.content.substring(0, 100)}...
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You don&apos;t have any lessons yet.</p>
      )}
    </div>

   
  </div>
  );
}
