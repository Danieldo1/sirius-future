import {motion} from 'framer-motion'
const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;
  
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4"><span className="uppercase">{user.name}</span>&apos;s Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Surname:</strong> {user.surname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            {user.middleName && <p><strong>Middle Name:</strong> {user.middleName}</p>}
            <p><strong>Lessons Purchased:</strong> {user.hasPurchasedLessons ? 'Yes' : 'No'}</p>
            {user.hasPurchasedLessons && (
              <p><strong>Number of Lessons:</strong> {user.numberOfLessons}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="mt-6 w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  };
  
  export default UserProfileModal;