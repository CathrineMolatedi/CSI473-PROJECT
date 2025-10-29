import { useEffect } from 'react';

const OfflineSyncService = () => {
    const syncData = async () => {
        // Logic to sync data with the server
        // This could involve fetching data from local storage
        // and sending it to the server when online
    };

    const checkConnectivity = () => {
        // Logic to check if the application is online
        return navigator.onLine;
    };

    useEffect(() => {
        const handleOnline = () => {
            if (checkConnectivity()) {
                syncData();
            }
        };

        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return {
        syncData,
        checkConnectivity,
    };
};

export default OfflineSyncService;