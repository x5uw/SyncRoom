import FeaturedRooms from "@/components/FeaturedRooms";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        <FeaturedRooms />
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <RightSidebar />
      </div>
    </div>
  );
}
