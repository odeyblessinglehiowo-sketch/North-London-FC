export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white text-black p-10 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your registration has been confirmed. We’ll see you at the watch party!
        </p>

        <a
          href="/"
          className="inline-block bg-[#EF0107] text-white px-6 py-3 rounded-lg"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}