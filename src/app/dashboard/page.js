"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Payment from "@/components/Payment";
import Image from "next/image";

export default function Dashboard() {
  const [lessons, setLessons] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchLessons();
    }
  }, [status, router]);

  const fetchLessons = async () => {
    const response = await fetch("/api/lessons");
    if (response.ok) {
      const data = await response.json();
      setLessons(data.lessons);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold ">Dashboard</h1>
      <div className="container mx-auto px-0.5 py-4">
        <div
          className={`bg-white p-6 rounded shadow ${
            lessons && lessons.length < 0 ? "grid md:grid-cols-2 gap-8" : ""
          }`}
        >
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Lessons</h2>
            {lessons.length > 0 ? (
              <ul className="space-y-2">
                {lessons.map((lesson, index) => (
                  <li key={index} className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <div className="mt-2 mb-4 flex justify-center">
                      <Image
                        src="/lesson.png"
                        width={200}
                        height={200}
                        alt={lesson.title}
                        className=""
                      />
                    </div>
                    <p className="text-gray-600">
                      {lesson.content.substring(0, 100)}...
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">You don't have any lessons yet!</p>
            )}
          </div>
          {lessons && lessons.length === 0 && (
            <div >
              <Payment onPaymentSuccess={fetchLessons} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
