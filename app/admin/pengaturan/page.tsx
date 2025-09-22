import { Megaphone, Plus } from "lucide-react";
import React, { useState } from 'react';

export default function SettingPage() {
    return (
        <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Megaphone  className="mr-3 text-blue-600" size={28} />
                    Pengaturan SIM Keliling
                    </h1>
                    <p className="text-gray-600 mt-1">Kelola pengaturan layanan SIM Keliling</p>
                </div>
                </div>
            </div>

        </div>
    );
}