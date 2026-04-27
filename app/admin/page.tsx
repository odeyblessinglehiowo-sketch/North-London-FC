import { supabase } from "@/lib/supabase";

export default async function Admin() {
  const { data } = await supabase.from("registrations").select("*");

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Registrations</h1>

      {data?.map((item:any)=>(
        <div key={item.id} className="border p-4 mb-2">
          {item.first_name} {item.last_name} - ₦{item.amount}
        </div>
      ))}
    </div>
  );
}