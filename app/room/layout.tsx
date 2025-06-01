import NavBar from "@/components/NavBar";

export default function RoomLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">


            {/* The rest of the page (e.g. RoomUI) will go here */}
            <main className="flex-1">{children}</main>
        </div>
    );
}