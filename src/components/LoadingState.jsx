const loadingMessages = [
  'Reading message...',
  'Analyzing threat indicators...',
  'Checking for scam patterns...',
  'Building your safety report...'
];

export default function LoadingState({ message }) {
  return (
    <div className="loading-container fade-in">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}</p>
    </div>
  );
}
