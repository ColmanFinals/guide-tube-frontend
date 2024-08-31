import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Box, Button, useTheme } from '@mui/material';
import LoadingPage from "../LoadingPage.tsx";
import PageTopTitle from "../../PageTopTitle.tsx";
import axios from 'axios';

interface GuideData {
    name: string;
    views: number;
}

interface CompanyData {
    _id: number;
    count: number;
}

interface AdminLoginData {
    fullName: string;
    logins: number;
}

const AnalyticsPage: React.FC = () => {
    const theme = useTheme();
    const [guideData, setGuideData] = useState<GuideData[]>([]);
    const [companyData, setCompanyData] = useState<CompanyData[]>([]);
    const [adminLogins, setAdminLogins] = useState<AdminLoginData[]>([]);
    const [loading, setLoading] = useState(true);
    const [useFakeData, setUseFakeData] = useState(false);

    const fakeGuideData: GuideData[] = [
        { name: 'Guide 1', views: 100 },
        { name: 'Guide 2', views: 200 },
        { name: 'Guide 3', views: 300 }
    ];

    const fakeCompanyData: CompanyData[] = [
        { _id: 1, count: 50 },
        { _id: 2, count: 75 },
        { _id: 3, count: 100 }
    ];

    const fakeAdminLogins: AdminLoginData[] = [
        { fullName: 'Admin A', logins: 30 },
        { fullName: 'Admin B', logins: 45 },
        { fullName: 'Admin C', logins: 60 }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [guidesResponse, companiesResponse, adminLoginsResponse] = await Promise.all([
                    axios.get('/api/analytics/views-per-guide'),
                    axios.get('/api/analytics/companies-over-time'),
                    axios.get('/api/analytics/admin-logins')
                ]);

                if (Array.isArray(guidesResponse.data) && guidesResponse.data.length > 0) {
                    setGuideData(guidesResponse.data);
                } else {
                    setGuideData([]); // Empty array if no data
                }

                if (Array.isArray(companiesResponse.data) && companiesResponse.data.length > 0) {
                    setCompanyData(companiesResponse.data);
                } else {
                    setCompanyData([]); // Empty array if no data
                }

                if (Array.isArray(adminLoginsResponse.data) && adminLoginsResponse.data.length > 0) {
                    setAdminLogins(adminLoginsResponse.data);
                } else {
                    setAdminLogins([]); // Empty array if no data
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
                setGuideData([]);
                setCompanyData([]);
                setAdminLogins([]);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            const resizeCharts = (chart: echarts.ECharts) => {
                window.addEventListener('resize', chart.resize);
            };

            const videoViewsChart = echarts.init(document.getElementById('videoViewsChart') as HTMLDivElement);
            videoViewsChart.setOption({
                title: {
                    text: 'Views per Guide',
                    left: 'center',
                    textStyle: {
                        color: theme.palette.text.primary,
                        fontSize: 22,
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: 'Views',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: (useFakeData ? fakeGuideData : guideData).map(guide => ({ value: guide.views, name: guide.name })),
                        label: {
                            color: theme.palette.text.primary,
                            fontSize: 18,
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
            resizeCharts(videoViewsChart);

            const companiesChart = echarts.init(document.getElementById('companiesChart') as HTMLDivElement);
            companiesChart.setOption({
                title: {
                    text: 'Companies Over Time',
                    left: 'center',
                    textStyle: {
                        color: theme.palette.text.primary,
                        fontSize: 22,
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: (useFakeData ? fakeCompanyData : companyData).map(company => company._id.toString()) // Ensure ID is a string
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'Companies',
                        type: 'line',
                        data: (useFakeData ? fakeCompanyData : companyData).map(company => company.count),
                        label: {
                            color: theme.palette.text.primary,
                            fontSize: 18,
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
            resizeCharts(companiesChart);

            const adminLoginsChart = echarts.init(document.getElementById('adminLoginsChart') as HTMLDivElement);
            adminLoginsChart.setOption({
                title: {
                    text: 'Admin Logins',
                    left: 'center',
                    textStyle: {
                        color: theme.palette.text.primary,
                        fontSize: 22,
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        name: 'Logins',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: (useFakeData ? fakeAdminLogins : adminLogins).map(admin => ({ value: admin.logins, name: admin.fullName })),
                        label: {
                            color: theme.palette.text.primary,
                            fontSize: 18,
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
            resizeCharts(adminLoginsChart);

            return () => {
                videoViewsChart.dispose();
                companiesChart.dispose();
                adminLoginsChart.dispose();
            };
        }
    }, [loading, guideData, companyData, adminLogins, useFakeData, theme]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                position: 'relative', // Add this line to allow absolute positioning of the button
            }}>
            <PageTopTitle pageTitle="Analytics" />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                className="p-5"
                sx={{ flexGrow: 1 }} // Allows the charts to take available space
            >
                <Box id="videoViewsChart" sx={{ height: { xs: '300px', md: '400px' }, width: '100%', marginBottom: '20px' }} />
                <Box id="companiesChart" sx={{ height: { xs: '300px', md: '400px' }, width: '100%', marginBottom: '20px' }} />
                <Box id="adminLoginsChart" sx={{ height: { xs: '300px', md: '400px' }, width: '100%', marginBottom: '20px' }} />
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setUseFakeData(prev => !prev)}
                sx={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    fontSize: '12px', // Smaller font size
                    padding: '6px 12px', // Smaller padding
                }}
            >
                {useFakeData ? 'Show Real Data' : 'Show Fake Data'}
            </Button>
        </Box>
    );
};

export default AnalyticsPage;
