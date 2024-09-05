
import { motion } from "framer-motion";

const SavedPaymentMethod = ({ paymentMethod }) => {
    if (!paymentMethod) {
      return null;
    }
  
    return (
      <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Payment Method</h2>
        <div>
          <p className="text-gray-600">Card ending in {paymentMethod.last4}</p>
          <p className="text-gray-600">Expires: {paymentMethod.expirationMonth}/{paymentMethod.expirationYear}</p>
        </div>
        <div className="mt-4 p-3 bg-green-100 rounded-md">
          <p className="text-green-700">This card is securely saved for future purchases.</p>
        </div>
      </motion.div>
    );
  };
  
  export default SavedPaymentMethod;