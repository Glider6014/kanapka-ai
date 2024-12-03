import Sidebar from "@/components/Sidebar";
import {Navbar} from "@/components/Navbar";

export default function SettingsPage() {
    return (
        <div className="container mx-auto p-4">
            <Navbar />
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Sidebar />

                <div className="flex-1 p-6 bg-gray-50 md:ml-72">
                    <h1 className="text-2xl font-semibold text-gray-800">Welcome to Settings</h1>
                    <p className="text-gray-700">Select a tab to manage your settings.</p>
                </div>
            </div>
        </div>
    );
}
