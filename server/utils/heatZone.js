/**
 * Utility to classify heat zones based on temperature.
 */
export const classifyHeatZone = (tempC) => {
    if (tempC >= 45) {
        return {
            zone: 'Extreme Danger',
            riskLevel: 'high',
            color: '#b91c1c',
        };
    }
    if (tempC >= 40) {
        return {
            zone: 'Severe Heat',
            riskLevel: 'high',
            color: '#dc2626',
        };
    }
    if (tempC >= 35) {
        return {
            zone: 'High Heat',
            riskLevel: 'medium',
            color: '#d97706',
        };
    }
    if (tempC >= 30) {
        return {
            zone: 'Warm',
            riskLevel: 'medium',
            color: '#fbbf24',
        };
    }
    return {
        zone: 'Normal',
        riskLevel: 'low',
        color: '#16a34a',
    };
};
