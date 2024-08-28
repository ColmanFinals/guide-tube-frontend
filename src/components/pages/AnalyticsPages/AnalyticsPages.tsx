import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Box, useTheme, Typography, Container } from '@mui/material';
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

    const fallbackGuideData: GuideData[] = [
        { name: "Tutorial", views: 120 },
        { name: "Review", views: 80 },
        { name: "Vlog", views: 50 },
        { name: "Live Stream", views: 30 }
    ];

    const fallbackCompanyData: CompanyData[] = [
        { _id: 1, count: 5 },
        { _id: 2, count: 10 },
        { _id: 3, count: 15 },
        { _id: 4, count: 20 }
    ];

    const fallbackAdminLogins: AdminLoginData[] = [
        { fullName: "Alice", logins: 15 },
        { fullName: "Bob", logins: 12 },
        { fullName: "Charlie", logins: 8 },
        { fullName: "David", logins: 5 }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [guidesResponse, companiesResponse, adminLoginsResponse] = await Promise.all([
                    axios.get('/api/analytics/views-per-guide'),
                    axios.get('/api/analytics/companies-over-time'),
                    axios.get('/api/analytics/admin-logins')
                ]);

                console.log('Guides Data:', guidesResponse.data);
                console.log('Companies Data:', companiesResponse.data);
                console.log('Admin Logins Data:', adminLoginsResponse.data);

                setGuideData(Array.isArray(guidesResponse.data) ? guidesResponse.data : fallbackGuideData);
                setCompanyData(Array.isArray(companiesResponse.data) ? companiesResponse.data : fallbackCompanyData);
                setAdminLogins(Array.isArray(adminLoginsResponse.data) ? adminLoginsResponse.data : fallbackAdminLogins);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
                setGuideData(fallbackGuideData);
                setCompanyData(fallbackCompanyData);
                setAdminLogins(fallbackAdminLogins);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            // Video views pie chart
            const videoViewsChart = echarts.init(document.getElementById('videoViewsChart') as HTMLDivElement);
            videoViewsChart.setOption({
                title: {
                    text: 'Views per Guide',
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
                        data: guideData.map(guide => ({ value: guide.views, name: guide.name })),
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

            // Companies over time chart
            const companiesChart = echarts.init(document.getElementById('companiesChart') as HTMLDivElement);
            companiesChart.setOption({
                title: {
                    text: 'Companies Over Time',
                    left: 'center',
                    textStyle: {
                        color: theme.palette.text.primary,
                        fontSize: 22,
                        textBorderColor: theme.palette.background.paper,
                        textBorderWidth: 4
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: companyData.map(company => company._id)
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'Companies',
                        type: 'line',
                        data: companyData.map(company => company.count),
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
                        data: adminLogins.map(admin => ({ value: admin.logins, name: admin.fullName })),
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

            return () => {
                videoViewsChart.dispose();
                companiesChart.dispose();
                adminLoginsChart.dispose();
            };
        }
    }, [loading, guideData, companyData, adminLogins, theme]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Container>
            <PageTopTitle title="Analytics" />
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box id="videoViewsChart" style={{ height: '400px', width: '100%', marginBottom: '20px' }} />
                <Box id="companiesChart" style={{ height: '400px', width: '100%', marginBottom: '20px' }} />
                <Box id="adminLoginsChart" style={{ height: '400px', width: '100%', marginBottom: '20px' }} />
            </Box>
        </Container>
    );
};

export default AnalyticsPage;