const APK_URL = "http://mss-webhosting-bucket.s3-website.eu-north-1.amazonaws.com/mss-app-release.apk";

const MobileAppInfo: React.FC = () => (
  
    <div className="welcome" style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2 style={{ color: '#007bff' }}>Mobile Application</h2>
      <p>
        The mobile application provides the same features and user experience as the web app, including stock data, news, and weather information.
        <br /><br />
        You can download and install the Android version here:
      </p>
      <a
        href={APK_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', marginTop: 16, fontWeight: 'bold', color: '#007bff' }}
      >
        Download Android App (APK)
      </a>
      <p style={{ marginTop: 24, color: '#888', fontSize: 14 }}>
        Note: You may need to allow installation from unknown sources on your device.
      </p>
    </div>
);


export default MobileAppInfo;