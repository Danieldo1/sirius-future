"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const ReferralInfo = () => {
    const { data: session, status } = useSession()
  const [referralInfo, setReferralInfo] = useState(null);

  useEffect(() => {
    if (session) {
      fetchReferralInfo();
    }
  }, [session]);

  const fetchReferralInfo = async () => {
    try {
      const response = await fetch("/api/referral/info");
      if (response.ok) {
        const data = await response.json();
        setReferralInfo(data);
      }
    } catch (error) {
      console.error("Error fetching referral info:", error);
    }
  };

  return (
    <>
      {referralInfo && (
        <div className="mt-8 bg-surface p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Your Referrals</h2>
          {referralInfo?.referrals.length > 0 ? (
            <div className="w-500px max-h-80 overflow-y-auto">
              <ul className="space-y-4">
                {referralInfo.referrals.map((referral, index) => (
                  <li key={index} className="bg-white p-4 rounded shadow">
                    <p className="font-semibold">
                      Referral Code: {referral.code}
                    </p>
                    <p>Referred Users:</p>
                    <ul className="list-disc list-inside">
                      {referral.referredUsers.map((user, userIndex) => (
                        <li key={userIndex}>
                          {user.name} ({user.email})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>You haven&apos;t referred anyone yet.</p>
          )}

          {referralInfo?.referredBy && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                You Were Referred By
              </h2>
              <p>
                {referralInfo.referredBy.name} ({referralInfo.referredBy.email})
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ReferralInfo;
