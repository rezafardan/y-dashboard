import LayoutDashboard from "@/components/dashboar-layout";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LayoutDashboard>
        <div className="w-full flex justify-center">Main Dashboard</div>
      </LayoutDashboard>
    </div>
  );
}
