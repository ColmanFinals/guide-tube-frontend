import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Box, useTheme } from '@mui/material';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [guidesResponse, companiesResponse, adminLoginsResponse] = await Promise.all([
                    axios.get('/api/analytics/views-per-guide'),
                    axios.get('/api/analytics/companies-over-time'),
                    axios.get('/api/analytics/admin-logins')
                ]);

                setGuideData(guidesResponse.data);
                setCompanyData(companiesResponse.data);
                setAdminLogins(adminLoginsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
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
                        data: adminLogins.map(login => ({ value: login.logins, name: login.fullName })),
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
    }, [loading, guideData, companyData, adminLogins, theme]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className='h-full w-full'>
            <PageTopTitle pageTitle="Analytics" />
            <Box id="videoViewsChart" sx={{ width: '600px', height: '400px', margin: '0 auto', paddingTop: '1%' }} />
            <Box id="companiesChart" sx={{ width: '600px', height: '400px', margin: '0 auto', marginTop: '40px' }} />
            <Box id="adminLoginsChart" sx={{ width: '600px', height: '400px', margin: '0 auto', marginTop: '40px' }} />
        </div>
    );
};

export default AnalyticsPage;