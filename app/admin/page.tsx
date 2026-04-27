"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  // 🔐 CHECK AUTH (REAL LOGIN)
  useEffect(() => {
    const checkUser = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/admin/login");
      }
    };

    checkUser();
  }, []);

  // 📡 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setData(data || []);
      }
    };

    fetchData();
  }, []);

  // 💰 TOTAL REVENUE
  const totalRevenue = data.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  // 🔍 FILTER
  const filteredData = filter
    ? data.filter((item) => item.package === filter)
    : data;

  // ❌ DELETE
  const deleteItem = async (id: number) => {
    const confirmDelete = confirm("Delete this registration?");
    if (!confirmDelete) return;

    await supabase.from("registrations").delete().eq("id", id);

    setData((prev) => prev.filter((item) => item.id !== id));
  };

  // 📊 EXPORT CSV
  const exportCSV = () => {
    const header = "First,Last,Email,Location,Package,Amount\n";

    const rows = data
      .map((row) =>
        [
          row.first_name,
          row.last_name,
          row.email,
          row.location,
          row.package,
          row.amount,
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      
      {/* 🔝 HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-3 flex-wrap">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="bg-black border border-white/20 px-3 py-2 rounded"
          >
            <option value="">All Packages</option>
            <option value="single">Single</option>
            <option value="couple">Couple</option>
            <option value="group">Group</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* 💰 STATS */}
      <div className="mb-8 bg-[#111] border border-white/10 p-6 rounded-xl">
        <p className="text-gray-400 text-sm">Total Revenue</p>
        <h2 className="text-3xl font-bold text-[#EF0107]">
          ₦{totalRevenue.toLocaleString()}
        </h2>
      </div>

      {/* 📋 LIST */}
      <div className="grid gap-4">
        {filteredData.length === 0 && (
          <p className="text-gray-500">No registrations found.</p>
        )}

        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-[#111] border border-white/10 p-5 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          >
            <div>
              <p className="font-semibold text-lg">
                {item.first_name} {item.last_name}
              </p>

              <p className="text-gray-400 text-sm">
                {item.email} • {item.location}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[#EF0107] font-bold text-lg">
                  ₦{item.amount}
                </p>

                <p className="text-gray-500 text-xs">
                  {item.package}
                </p>
              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}