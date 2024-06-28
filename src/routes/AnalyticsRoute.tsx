import React from 'react';
import { Route } from 'react-router-dom';
import AnalyticsPage from '../components/pages/AnalyticsPage';

const AnalyticsRoute: React.FC = () => {
    // @ts-ignore
    return (
        <Route path="/analytics" component={AnalyticsPage} />
    );
};

export default AnalyticsRoute;
