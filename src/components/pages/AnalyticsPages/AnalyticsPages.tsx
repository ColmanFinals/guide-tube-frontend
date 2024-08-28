import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { Box, useTheme } from '@mui/material';
import LoadingPage from "../LoadingPage.tsx";
import PageTopTitle from "../../PageTopTitle.tsx";

interface VideoViewData {
    category: string;
    views: number;
}

interface AdminLoginData {
    admin: string;
    logins: number;
}

interface AnalyticsData {
    videoViews: VideoViewData[];
    adminLogins: AdminLoginData[];
}

const AnalyticsPage: React.FC = () => {
    const theme = useTheme();
    const data: AnalyticsData = {
        videoViews: [
            { category: "Tutorial", views: 120 },
            { category: "Review", views: 80 },
            { category: "Vlog", views: 50 },
            { category: "Live Stream", views: 30 }
        ],
        adminLogins: [
            { admin: "Alice", logins: 15 },
            { admin: "Bob", logins: 12 },
            { admin: "Charlie", logins: 8 },
            { admin: "David", logins: 5 }
        ]
    };

    useEffect(() => {
        if (data) {
            // Video views pie chart
            const videoViewsChart = echarts.init(document.getElementById('videoViewsChart') as HTMLDivElement);
            videoViewsChart.setOption({
                title: {
                    text: 'Video Views',
                    left: 'center',
                    textStyle: {
                        color: theme.palette.text.primary,
                        fontSize: 22,
                        textBorderColor: theme.palette.background.paper,
                        textBorderWidth: 4
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: 'Views',
                        type: 'pie',
                        radius: '50%',
                        data: data.videoViews.map(view => ({ value: view.views, name: view.category })),
                        label: {
                            color: theme.palette.text.primary,
                            fontSize: 18,
                            textBorderColor: theme.palette.background.paper,
                            textBorderWidth: 4
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });

            // Admin logins pie chart
            const adminLoginsChart = echarts.init(document.getElementById('adminLoginsChart') as HTMLDivElement);
            adminLoginsChart.setOption({
                title: {
                    text: 'Admin Logins',
                    left: 'center',
                    textStyle: {
                        color: theme.palette.text.primary,
                        fontSize: 22,
                        textBorderColor: theme.palette.background.paper,
                        textBorderWidth: 4
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: 'Logins',
                        type: 'pie',
                        radius: '50%',
                        data: data.adminLogins.map(login => ({ value: login.logins, name: login.admin })),
                        label: {
                            color: theme.palette.text.primary,
                            fontSize: 18,
                            textBorderColor: theme.palette.background.paper,
                            textBorderWidth: 4
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
    }, [data, theme]);

    return (
        <div className='h-full w-full'>
            <PageTopTitle pageTitle="Analytics" />
            <Box id="videoViewsChart" sx={{ width: '600px', height: '400px', margin: '0 auto', paddingTop: '1%' }} />
            <Box id="adminLoginsChart" sx={{ width: '600px', height: '400px', margin: '0 auto', marginTop: '40px' }} />
        </div>
    );
};

export default AnalyticsPage;