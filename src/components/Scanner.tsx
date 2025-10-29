import React, { useEffect, useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';

const Scanner: React.FC = () => {
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const qrReaderRef = useRef<any>(null);

    const handleScan = (result: any) => {
        if (result) {
            setData(result);
        }
    };

    const handleError = (err: any) => {
        setError(err.message);
    };

    useEffect(() => {
        if (data) {
            // Handle the scanned data (e.g., send it to the server or display it)
            console.log('Scanned data:', data);
        }
    }, [data]);

    return (
        <div>
            <h2>QR Code Scanner</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <QrReader
                ref={qrReaderRef}
                onScan={handleScan}
                onError={handleError}
                style={{ width: '100%' }}
            />
            {data && <p>Scanned Data: {data}</p>}
        </div>
    );
};

export default Scanner;