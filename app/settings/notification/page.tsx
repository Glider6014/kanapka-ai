import Sidebar from "@/components/Sidebar";
import {Navbar} from "@/components/Navbar";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";


export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <Navbar />
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Sidebar />

                <div className="flex-1 p-6 bg-gray-50 md:ml-72">

                    <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                    <div className="flex items-center justify-between mb-4">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <Switch id="push-notifications" />
                    </div>
                </div>
        </div>
    </div>
    );
}
