"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";

export default function Home() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  location: "",
  phone: "",
  email: "",
  package: "",
});
const [popup, setPopup] = useState({
  show: false,
  message: "",
  type: "success", // success | error
});
const showPopup = (message: string, type = "success") => {
  setPopup({ show: true, message, type });

  setTimeout(() => {
    setPopup({ show: false, message: "", type: "success" });
  }, 3000);
};
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      setPos({ x, y });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const [packageType, setPackageType] = useState("");
  const [amount, setAmount] = useState(0);

  const handlePackageChange = (type: string) => {
    setPackageType(type);

    if (type === "single") setAmount(5000);
    if (type === "couple") setAmount(9000);
    if (type === "group") setAmount(20000);
  };
  const checkDuplicate = async () => {
  const { data, error } = await supabase
    .from("registrations")
    .select("id")
    .eq("email", form.email)
    .eq("package", form.package);

  if (error) {
    console.log("Duplicate check error:", error);
    return false;
  }

  return data && data.length > 0;
};
const payWithPaystack = () => {
  const PaystackPop = (window as any).PaystackPop;

  if (!PaystackPop) {
    alert("Paystack not loaded");
    return;
  }

  const handler = PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
    email: form.email,
    amount: amount * 100,
    ref: "" + new Date().getTime(),

    // ❌ REMOVE async
    callback: function (response: any) {
      console.log("Payment success:", response);

      // 👇 handle async INSIDE
      saveToDatabase(response);
    },

    onClose: function () {
      console.log("Payment closed");
    },
  });

  handler.openIframe();
};



const saveToDatabase = async (response: any) => {
  const { error } = await supabase.from("registrations").insert([
    {
      first_name: form.firstName,
      last_name: form.lastName,
      location: form.location,
      email: form.email,
      package: form.package,
      amount: amount,
      reference: response.reference,
    },
  ]);

  if (!error) {
    // 🔥 SEND EMAIL
    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        firstName: form.firstName,
      }),
    });

    // ✅ SHOW POPUP
    showPopup("Payment successful 🎉 Confirmation sent to email!");
  } else {
    showPopup("Payment successful but failed to save data", "error");
  }
};

  return (
    
    <main className="bg-black text-white min-h-screen overflow-hidden">

      <section className="relative min-h-[65vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden">

  {/* 🔴 Glow */}
  <div
    className="absolute w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-[#EF0107] opacity-20 blur-[120px] md:blur-[160px] rounded-full transition-all duration-300"
    style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
  />

  {/* ⚽ Floating balls */}
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg"
    alt=""
    width={60}
    height={60}
    className="absolute top-[8%] left-[6%] md:top-[10%] md:left-[10%] opacity-60 md:opacity-70 animate-spin-slow"
    style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
  />

  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg"
    alt=""
    width={50}
    height={50}
    className="absolute bottom-[8%] right-[6%] md:bottom-[10%] md:right-[10%] opacity-50 md:opacity-60 animate-bounce"
  />

  {/* 🔴 Arsenal logos (hide one on mobile) */}
  <Image
    src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg"
    alt=""
    width={140}
    height={140}
    className="hidden md:block absolute top-[20%] left-[30%] opacity-10 animate-pulse"
  />

  <Image
    src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg"
    alt=""
    width={90}
    height={90}
    className="absolute bottom-[18%] right-[20%] opacity-10 animate-ping"
  />

  {/* 🔝 Top badge */}
  <div className="mb-4 md:mb-6 bg-[#EF0107] px-4 md:px-6 py-2 tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-sm">
    ★ CHAMPIONS LEAGUE FINAL ★
  </div>

  {/* 🧠 MAIN TITLE */}
  <div className="leading-[0.9] md:leading-[0.85] font-extrabold uppercase">

    <h1 className="text-[40px] sm:text-[55px] md:text-[110px] lg:text-[140px]">
      THE
    </h1>

    <h1 className="text-[50px] sm:text-[70px] md:text-[140px] lg:text-[180px]">
      EMIRATES
    </h1>

    <h1 className="text-[50px] sm:text-[70px] md:text-[140px] lg:text-[180px]">
      OF ABUJA
    </h1>

  </div>

  {/* 🔴 Glow under text */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="w-[250px] md:w-[500px] h-[120px] md:h-[200px] bg-[#EF0107] opacity-20 blur-[70px] md:blur-[100px]" />
  </div>

  {/* 🔻 Sub text */}
  <p className="mt-4 md:mt-6 text-[#EF0107] text-lg md:text-3xl tracking-widest">
    Arsenal Watch Party
  </p>

  <p className="text-gray-500 tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-sm mt-1 md:mt-2">
    THE NYANYA-LONDON EDITION
  </p>

  {/* ⭐ Bottom */}
  <div className="mt-6 md:mt-10 flex items-center gap-4 md:gap-6 text-sm md:text-xl tracking-[0.4em] md:tracking-[0.5em]">
    <span className="text-yellow-400">★★★</span>
    <span className="text-gray-300">UCL FINAL</span>
    <span className="text-yellow-400">★★★</span>
  </div>

</section>

      <section className="py-10 px-6 text-center bg-[#fff5f5] text-black">

  <div className="max-w-4xl mx-auto space-y-8">

    {/* TOP TEXT */}
    <p className="text-lg md:text-xl italic text-gray-600 leading-relaxed">
      The journey to the trophy reaches its climax! We aren't just watching a match —
    </p>

    {/* HIGHLIGHT */}
    <h2 className="text-2xl md:text-3xl font-bold text-[#EF0107] tracking-wide">
      We're creating an atmosphere.
    </h2>

    {/* MID TEXT */}
    <p className="text-lg md:text-xl italic text-gray-600 leading-relaxed">
      Join the most passionate Gooners in the FCT for the Champions League Final.
    </p>

    {/* MAIN STATEMENT */}
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">

      <span className="text-black">North London is Red. </span>

      <span className="text-[#EF0107] block md:inline">
        Nyanya is Redder.
      </span>

    </h1>

  </div>
</section>
<section className="relative py-8 md:py-10 px-5 text-center text-white overflow-hidden">

  {/* 🔴 BACKGROUND */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3a0000,black_70%)]" />
  <div className="absolute inset-0 bg-[#EF0107] opacity-[0.06] blur-3xl" />

  {/* ⚽ TOP LEFT BALL */}
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg"
    className="hidden md:block absolute top-6 left-6 w-10 md:w-14 opacity-70 animate-bounce-slow [animation-delay:1.4s]"
  />

  {/* ⚽ BOTTOM RIGHT BALL */}
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg"
    className="absolute bottom-6 right-6 w-12 md:w-16 opacity-70 animate-bounce-slow delay-200"
  />

  <div className="relative max-w-4xl mx-auto space-y-10">

    {/* ================= TABLE ================= */}
    <div className="rounded-xl overflow-hidden border border-white/20">

  <div className="grid grid-cols-2 text-sm md:text-base">

    <div className="bg-[#2a0000] p-3 md:p-4 border border-white/10 text-[#EF0107] font-bold text-left">
      Event
    </div>
    <div className="bg-black p-3 md:p-4 border border-white/10 text-gray-300 text-left">
      UCL Final: Arsenal vs. The World
    </div>

    <div className="bg-[#2a0000] p-3 md:p-4 border border-white/10 text-[#EF0107] font-bold text-left">
      Location
    </div>
    <div className="bg-black p-3 md:p-4 border border-white/10 text-gray-300 text-left">
      Exclusive Venue · Nyanya-Karu, Abuja
    </div>

    <div className="bg-[#2a0000] p-3 md:p-4 border border-white/10 text-[#EF0107] font-bold text-left">
      Vibe
    </div>
    <div className="bg-black p-3 md:p-4 border border-white/10 text-gray-300 text-left">
      Large Screens · Stadium Sound · 100% Passion
    </div>

    <div className="bg-[#2a0000] p-3 md:p-4 border border-white/10 text-[#EF0107] font-bold text-left">
      Entry
    </div>
    <div className="bg-black p-3 md:p-4 border border-white/10 text-gray-300 text-left">
      Registration Required
    </div>

  </div>
</div>

    {/* ================= CTA ================= */}
    <div className="space-y-4">

      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
        READY TO CLAIM <br /> THE THRONE?
      </h1>

      <p className="italic text-gray-400 text-base md:text-lg">
        Seats are limited to ensure the best viewing experience.
      </p>

      <p className="italic text-gray-400 text-base md:text-lg">
        Secure your spot in the "North London of Abuja" today.
      </p>

      {/* WHATSAPP CTA */}
      <a
        href="https://wa.me/2348145471258"
        target="_blank"
        className="inline-block bg-[#EF0107] hover:bg-red-700 transition px-6 py-3 text-lg md:text-xl font-bold rounded-lg shadow-lg"
      >
        JOIN VIA WHATSAPP
      </a>

      {/* SCROLL */}
      <p className="text-gray-400 italic text-sm">
        Or register on the form below ↓
      </p>

      <p className="italic text-gray-500 text-sm">
        Inquire about Location & Registration Fees
      </p>

    </div>

  </div>
</section>
   <section className="relative py-10 px-6 bg-[#f4f4f4] text-black overflow-hidden">

  {/* 🔴 Arsenal watermark */}
  <div className="absolute inset-0 flex items-center justify-center opacity-[0.035]">
    <Image
      src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg"
      alt=""
      width={600}
      height={600}
      className="object-contain"
    />
  </div>

  <div className="relative max-w-lg mx-auto">

    <h2 className="px-5 text-center text-2xl md:text-4xl font-extrabold mb-8">
      Register for Watch Party ⚽
    </h2>

    <div className="bg-white rounded-xl p-6 md:p-7 shadow-lg border border-gray-200">

      <form className="space-y-4">

        {/* NAME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="First Name"
            className="input"
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
          />

          <input
            placeholder="Surname"
            className="input"
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />
        </div>

        {/* LOCATION + PHONE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Location"
            className="input"
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            className="input"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>

        {/* EMAIL */}
        <input
          placeholder="Email Address"
          className="input"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PACKAGE */}
        <select
          className="input"
          onChange={(e) => {
            handlePackageChange(e.target.value);
            setForm({ ...form, package: e.target.value });
          }}
        >
          <option value="">Select Package</option>
          <option value="single">Single — ₦5,000</option>
          <option value="couple">Couple — ₦9,000</option>
          <option value="group">Group (5+) — ₦20,000</option>
        </select>

        {/* AMOUNT */}
        <input
          value={`₦${amount}`}
          readOnly
          className="w-full p-3 bg-black text-white border border-black rounded-lg font-semibold text-center"
        />

        {/* BUTTON */}
        <button
          type="button"
        onClick={async (e) => {
  e.preventDefault();

  const { data: existing } = await supabase
    .from("registrations")
    .select("*")
    .eq("email", form.email)
    .eq("package", form.package);

  if (existing && existing.length > 0) {
    showPopup("You already registered for this package.", "error");
    return;
  }

  payWithPaystack();
}}
          className="w-full bg-[#EF0107] hover:bg-red-700 transition py-3 text-lg font-semibold rounded-lg text-white"
        >
          Proceed to Payment
        </button>

      </form>
    </div>
  </div>
</section>
   
{/* ================= HASHTAGS ================= */}
  <div className="border-t border-[#EF0107]/40 pt-6">

      <p className="text-[#EF0107] text-sm md:text-base tracking-wide text-center">
        #ArsenalAbuja · #NyanyaGooners · #UCLFinal · #ArsenalWatchParty · #AbujaEvents · #NyanyaLondon · #COYG
      </p>

    </div>
    {popup.show && (
  <div className="fixed top-6 right-6 z-50 animate-fadeIn">
    <div
      className={`px-6 py-4 rounded-lg shadow-lg text-white ${
        popup.type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {popup.message}
    </div>
  </div>
)}
    </main>
  );
}