import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Box, Typography } from '@mui/material';
import LoadingPage from "../LoadingPage.tsx";

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
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        fetch('/src/data/analyticsData.json')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching analytics data:', error));
    }, []);

    useEffect(() => {
        if (data) {
            // Video views pie chart
            const videoViewsChart = echarts.init(document.getElementById('videoViewsChart') as HTMLDivElement);
            videoViewsChart.setOption({
                title: {
                    text: 'Video Views',
                    left: 'center'
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
                    left: 'center'
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
    }, [data]);

    if (!data) {
        return <LoadingPage/>;
    }

    return (
        <Box>
            <Typography variant="h4" align="center" gutterBottom>
                Analytics Dashboard
            </Typography>
            <Box id="videoViewsChart" style={{ width: '600px', height: '400px', margin: '0 auto' }}></Box>
            <Box id="adminLoginsChart" style={{ width: '600px', height: '400px', margin: '0 auto', marginTop: '40px' }}></Box>
        </Box>
    );
};

export default AnalyticsPage;