const BACKEND_BASE_URL = 'http://localhost:5000/api';

// Fallback mock dataset
const MOCK_CAMERAS = [
  { id: 'CAM-01', name: 'Northern Perimeter - Fence Alpha', status: 'ALERT', threat: 'Human Intrusion (94%)', streamUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
  { id: 'CAM-02', name: 'Eastern Ridge - Sentry Post 3', status: 'CLEAR', threat: 'Normal', streamUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80' },
  { id: 'CAM-03', name: 'Buffer Zone - Thermal Sector B', status: 'ALERT', threat: 'Vehicle Crossing (88%)', streamUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { id: 'CAM-04', name: 'Southern Outpost - Gate Beta', status: 'CLEAR', threat: 'Normal', streamUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80' },
];

const MOCK_EVENTS = [
  { id: 'EVT-4091', timestamp: '17:24:02', camera: 'CAM-01', target: 'Person', confidence: '95.4%', severity: 'CRITICAL', zone: 'Perimeter Alpha' },
  { id: 'EVT-4090', timestamp: '17:21:45', camera: 'CAM-03', target: 'Vehicle', confidence: '88.1%', severity: 'HIGH', zone: 'Buffer Zone B' },
  { id: 'EVT-4089', timestamp: '17:15:10', camera: 'CAM-02', target: 'Animal (Wildlife)', confidence: '92.0%', severity: 'LOW', zone: 'Eastern Ridge' },
  { id: 'EVT-4088', timestamp: '16:58:33', camera: 'CAM-01', target: 'Person', confidence: '91.2%', severity: 'HIGH', zone: 'Perimeter Alpha' },
  { id: 'EVT-4087', timestamp: '16:42:19', camera: 'CAM-04', target: 'Person', confidence: '78.5%', severity: 'MEDIUM', zone: 'Gate Beta' },
];

// Check if Member 2's backend server is reachable
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

// Fetch camera array (or mock fallback)
export async function fetchCameras() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/cameras`, { credentials: 'omit' });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return MOCK_CAMERAS;
  }
}

// Fetch intrusion event history (or mock fallback)
export async function fetchEvents() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/events`, { credentials: 'omit' });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return MOCK_EVENTS;
  }
}