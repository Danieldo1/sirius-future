"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UserProfileModal from "./UserProfileModal";

const ReferralInfo = ({ refreshTrigger }) => {
  const { data: session, status } = useSession();
  const [referralInfo, setReferralInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleUserClick = async (userId) => {
    if (!userId) {
      console.error('User ID is undefined')
      toast.error('Unable to fetch user details')
      return
    }
  
    try {
      const response = await fetch(`/api/user/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setSelectedUser(userData)
      } else {
        throw new Error('Failed to fetch user details')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Failed to load user details')
    }
  }

  if (!referralInfo) return <p>Loading referral information...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='md:col-span-2'
    >
      {referralInfo && (
        <div className="mt-8 bg-surface p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-semibold mb-4">Your Referrals</h2>
          {referralInfo.referrals.length > 0 ? (
            <ul className="space-y-4">
              {referralInfo.referrals.map((referral, index) => (
                <li key={index} className="bg-white p-4 rounded shadow">
                  <p className="font-semibold">
                    Referral Code: {referral.code}
                  </p>
                  <p>Referred Users:</p>
                  <ul className="underline space-y-1 text-primary animate-pulse">
                    {referral.referredUsers.map((user, userIndex) => (
                      <li
                        key={userIndex}
                        className="cursor-pointer text-primary hover:underline"
                        onClick={() => handleUserClick(user.id)}
                      >
                        {user.name} ({user.email})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven&apos;t referred anyone yet.</p>
          )}

          {referralInfo.referredBy && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                You Were Referred By
              </h2>
              <p
                className="cursor-pointer text-primary hover:underline"
                onClick={() => handleUserClick(referralInfo.referredBy.id)}
              >
                {referralInfo.referredBy.name} ({referralInfo.referredBy.email})
              </p>
            </div>
          )}

          {selectedUser && (
            <AnimatePresence mode="wait">

              <UserProfileModal
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
              />
            </AnimatePresence>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ReferralInfo;
