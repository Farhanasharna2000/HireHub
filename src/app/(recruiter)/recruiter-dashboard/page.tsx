'use client'
import DashboardLayout from '@/layouts/DashboardLayout';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const RecruiterDashboard = () => {
    const router=useRouter();
    const [dashboardData,setDashboardData]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    const getDashboardOverview=async()=>{
        try {
            setIsLoading(true)
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getDashboardOverview()
        return ()=>{}
    },[])
    return (
        <DashboardLayout activeMenu="recruiter-dashboard">
            
        </DashboardLayout>
    );
};

export default RecruiterDashboard;