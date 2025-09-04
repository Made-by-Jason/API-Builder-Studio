const { useState, useEffect, useRef } = React;
/* @tweakable fallback animation for when framer-motion is not available */
const motion = window.Motion || window['framer-motion'] || { 
    div: 'div', 
    button: 'button',
    AnimatePresence: ({ children }) => children
};
const AnimatePresence = motion.AnimatePresence || (({ children }) => children);

// Material Design 3 Components
function MaterialButton({ variant = 'filled', size = 'medium', children, onClick, disabled = false, className = '', icon }) {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20';
    
    const variants = {
        filled: 'bg-primary text-white hover:bg-primary/90 shadow-md3',
        outlined: 'border border-outline text-primary hover:bg-primary/8',
        text: 'text-primary hover:bg-primary/8'
    };
    
    const sizes = {
        small: 'px-3 py-2 text-sm rounded-md3-button',
        medium: 'px-4 py-2.5 text-base rounded-md3-button',
        large: 'px-6 py-3 text-lg rounded-md3-button'
    };
    
    const ButtonComponent = motion.button || 'button';
    
    return (
        <ButtonComponent
            whileHover={motion.button ? { scale: 1.02 } : undefined}
            whileTap={motion.button ? { scale: 0.98 } : undefined}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {icon && <span className="material-icons mr-2 text-sm">{icon}</span>}
            {children}
        </ButtonComponent>
    );
}

function MaterialCard({ children, className = '', elevated = false }) {
    return (
        <div className={`bg-white rounded-md3 border border-outline/20 ${elevated ? 'shadow-md3-elevated' : 'shadow-md3'} ${className}`}>
            {children}
        </div>
    );
}

function MaterialInput({ label, type = 'text', value, onChange, placeholder, className = '', multiline = false, rows = 4 }) {
    const [focused, setFocused] = useState(false);
    
    const InputComponent = multiline ? 'textarea' : 'input';
    
    return (
        <div className={`relative ${className}`}>
            <InputComponent
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={multiline ? rows : undefined}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`
                    w-full px-4 py-3 bg-surface-variant rounded-md3-input 
                    border-2 transition-all duration-200 resize-none
                    ${focused ? 'border-primary bg-surface' : 'border-transparent'}
                    focus:outline-none text-gray-900 placeholder-gray-500
                `}
            />
            {label && (
                <label className={`
                    absolute left-4 transition-all duration-200 pointer-events-none
                    ${focused || value ? 'text-xs -top-2 bg-surface px-1 text-primary' : 'text-sm top-3 text-gray-500'}
                `}>
                    {label}
                </label>
            )}
        </div>
    );
}

function MaterialSelect({ label, value, onChange, options, className = '' }) {
    const [focused, setFocused] = useState(false);
    
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`
                    w-full px-4 py-3 bg-surface-variant rounded-md3-input 
                    border-2 transition-all duration-200 appearance-none
                    ${focused ? 'border-primary bg-surface' : 'border-transparent'}
                    focus:outline-none text-gray-900
                `}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <span className="material-icons absolute right-4 top-3 text-gray-500 pointer-events-none">
                keyboard_arrow_down
            </span>
            {label && (
                <label className={`
                    absolute left-4 transition-all duration-200 pointer-events-none
                    ${focused || value ? 'text-xs -top-2 bg-surface px-1 text-primary' : 'text-sm top-3 text-gray-500'}
                `}>
                    {label}
                </label>
            )}
        </div>
    );
}

function MaterialSwitch({ checked, onChange, label }) {
    return (
        <div className="flex items-center space-x-3">
            <button
                onClick={() => onChange(!checked)}
                className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${checked ? 'bg-primary' : 'bg-outline/40'}
                `}
            >
                <div className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200
                    ${checked ? 'translate-x-7' : 'translate-x-1'}
                `} />
            </button>
            {label && <span className="text-sm text-gray-700">{label}</span>}
        </div>
    );
}

function MaterialChip({ label, onDelete, color = 'primary' }) {
    return (
        <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'}
        `}>
            {label}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="ml-2 text-current hover:bg-black/10 rounded-full p-0.5"
                >
                    <span className="material-icons text-sm">close</span>
                </button>
            )}
        </div>
    );
}

// Main App Component
function App() {
    const [endpoint, setEndpoint] = useState({
        method: 'GET',
        baseUrl: 'https://api.example.com',
        path: '/users',
        queryParams: [],
        headers: [
            { key: 'Content-Type', value: 'application/json', required: true }
        ],
        body: '',
        bodyType: 'json',
        corsEnabled: true,
        cacheEnabled: false,
        cacheTtl: 300,
        authRequired: false,
        outputFormat: 'json'
    });

    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('raw');
    const [mockResponse, setMockResponse] = useState({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        profile: {
            age: 30,
            preferences: ["coding", "coffee", "travel"],
            settings: {
                theme: "dark",
                notifications: true
            }
        }
    });
    /* @tweakable Maximum number of requests to keep in history */
    const [requestHistory, setRequestHistory] = useState([]);
    /* @tweakable Maximum number of requests to keep in history */
    const maxHistoryItems = 10; 

    /* @tweakable animation duration for transitions */
    const animationDuration = 300;

    /* @tweakable card spacing between components */
    const cardSpacing = 24;

    /* @tweakable default API name selected on load (must match a name in commonApis) */
    const [selectedApiName, setSelectedApiName] = useState(null);

    /* @tweakable Categories and configurations for common industry APIs */
    const [commonApis, setCommonApis] = useState({
        'Google APIs': [
            {
                name: 'Google Search Console',
                endpointConfig: {
                    method: 'GET',
                    baseUrl: 'https://www.googleapis.com/webmasters/v3',
                    path: '/sites',
                    queryParams: [],
                    headers: [{ key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN', required: true }],
                    body: '',
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: true,
                    cacheTtl: 600,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Google Analytics',
                endpointConfig: {
                    method: 'POST',
                    baseUrl: 'https://analyticsdata.googleapis.com/v1beta',
                    path: '/properties/GA_PROPERTY_ID:runReport',
                    queryParams: [],
                    headers: [
                        { key: 'Content-Type', value: 'application/json', required: true },
                        { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN', required: true }
                    ],
                    body: JSON.stringify({
                        "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
                        "dimensions": [{"name": "city"}],
                        "metrics": [{"name": "activeUsers"}]
                    }, null, 2),
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: false,
                    cacheTtl: 300,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Google Docs API',
                endpointConfig: {
                    method: 'GET',
                    baseUrl: 'https://docs.googleapis.com/v1',
                    path: '/documents/DOCUMENT_ID',
                    queryParams: [],
                    headers: [{ key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN', required: true }],
                    body: '',
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: true,
                    cacheTtl: 3600,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Google Sheets API',
                endpointConfig: {
                    method: 'GET',
                    baseUrl: 'https://sheets.googleapis.com/v4',
                    path: '/spreadsheets/SPREADSHEET_ID/values/Sheet1!A1:C10',
                    queryParams: [],
                    headers: [{ key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN', required: true }],
                    body: '',
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: true,
                    cacheTtl: 300,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Appscript API',
                endpointConfig: {
                    method: 'POST',
                    baseUrl: 'https://script.googleapis.com/v1',
                    path: '/scripts/SCRIPT_ID:run',
                    queryParams: [],
                    headers: [
                        { key: 'Content-Type', value: 'application/json', required: true },
                        { key: 'Authorization', value: 'Bearer YOUR_ACCESS_TOKEN', required: true }
                    ],
                    body: JSON.stringify({
                        "function": "myFunctionName",
                        "parameters": ["param1", "param2"]
                    }, null, 2),
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: false,
                    cacheTtl: 300,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Google Maps Geocoding API',
                endpointConfig: {
                    method: 'GET',
                    baseUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
                    path: '',
                    queryParams: [
                        { key: 'address', value: '1600 Amphitheatre Parkway, Mountain View, CA', required: true },
                        { key: 'key', value: 'YOUR_API_KEY', required: true }
                    ],
                    headers: [],
                    body: '',
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: true,
                    cacheTtl: 86400,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Google Cloud Vision API',
                endpointConfig: {
                    method: 'POST',
                    baseUrl: 'https://vision.googleapis.com/v1/images:annotate',
                    path: '',
                    queryParams: [{ key: 'key', value: 'YOUR_API_KEY', required: true }],
                    headers: [{ key: 'Content-Type', value: 'application/json', required: true }],
                    body: JSON.stringify({
                        "requests": [
                            {
                                "image": { "source": { "imageUri": "gs://cloud-samples-data/vision/label/wakeupcat.jpg" } },
                                "features": [{ "type": "LABEL_DETECTION", "maxResults": 1 }]
                            }
                        ]
                    }, null, 2),
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: false,
                    cacheTtl: 300,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Google Translate API',
                endpointConfig: {
                    method: 'POST',
                    baseUrl: 'https://translation.googleapis.com/language/translate/v2',
                    path: '',
                    queryParams: [{ key: 'key', value: 'YOUR_API_KEY', required: true }],
                    headers: [{ key: 'Content-Type', value: 'application/json', required: true }],
                    body: JSON.stringify({
                        "q": "Hello, world!",
                        "target": "es"
                    }, null, 2),
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: false,
                    cacheTtl: 300,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
        ],
        'SEO Tools': [
            {
                name: 'Ahrefs API - Site Explorer',
                endpointConfig: {
                    method: 'GET',
                    baseUrl: 'https://api.ahrefs.com/v3/site-explorer',
                    path: '/overview',
                    queryParams: [
                        { key: 'target', value: 'example.com', required: true },
                        { key: 'output', value: 'json', required: true },
                        { key: 'token', value: 'YOUR_AHREFS_API_TOKEN', required: true }
                    ],
                    headers: [],
                    body: '',
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: true,
                    cacheTtl: 3600,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Semrush API - Domain Overview',
                endpointConfig: {
                    method: 'GET',
                    baseUrl: 'https://api.semrush.com',
                    path: '',
                    queryParams: [
                        { key: 'type', value: 'domain_rank', required: true },
                        { key: 'key', value: 'YOUR_SEMRUSH_API_KEY', required: true },
                        { key: 'domain', value: 'example.com', required: true },
                        { key: 'database', value: 'us', required: true },
                        { key: 'export_columns', value: 'rank,organic_keywords,organic_traffic', required: true }
                    ],
                    headers: [],
                    body: '',
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: true,
                    cacheTtl: 3600,
                    authRequired: true,
                    outputFormat: 'json'
                }
            },
            {
                name: 'Sitechecker.pro API - Site Audit',
                endpointConfig: {
                    method: 'GET',
                    baseUrl: 'https://api.sitechecker.pro/v1',
                    path: '/site-audit',
                    queryParams: [
                        { key: 'domain', value: 'example.com', required: true },
                        { key: 'api_key', value: 'YOUR_SITECHECKER_API_KEY', required: true }
                    ],
                    headers: [],
                    body: '',
                    bodyType: 'json',
                    corsEnabled: true,
                    cacheEnabled: false,
                    cacheTtl: 300,
                    authRequired: true,
                    outputFormat: 'json'
                }
            }
        ]
    });


    useEffect(() => {
        if (selectedApiName) {
            let foundApi = null;
            // Iterate through categories and then APIs to find the selected one
            for (const category in commonApis) {
                const api = commonApis[category].find(api => api.name === selectedApiName);
                if (api) {
                    foundApi = api;
                    break;
                }
            }
            if (foundApi) {
                // Deep copy the endpointConfig to avoid mutation issues
                setEndpoint(JSON.parse(JSON.stringify(foundApi.endpointConfig)));
            }
        }
    }, [selectedApiName, commonApis]);

    const sendRequest = async () => {
        setIsLoading(true);
        const startTime = Date.now();
        
        // Simulate API call
        setTimeout(() => {
            const newResponse = {
                status: 200,
                statusText: 'OK',
                data: mockResponse, // Use mockResponse for the actual data
                responseTime: Date.now() - startTime
            };
            setResponse(newResponse);
            setIsLoading(false);

            // Add to history
            setRequestHistory(prevHistory => {
                const newHistoryItem = {
                    endpointConfig: JSON.parse(JSON.stringify(endpoint)), // Deep copy current endpoint
                    response: newResponse,
                    timestamp: new Date().toLocaleString()
                };
                // Keep only the latest `maxHistoryItems`
                return [newHistoryItem, ...prevHistory].slice(0, maxHistoryItems);
            });
        }, 1000);
    };

    const loadFromHistory = (index) => {
        const historyItem = requestHistory[index];
        if (historyItem) {
            setEndpoint(JSON.parse(JSON.stringify(historyItem.endpointConfig))); // Deep copy
            setResponse(historyItem.response);
            setActiveTab('raw'); // Switch to raw view when loading from history
        }
    };

    const clearHistory = () => {
        setRequestHistory([]);
    };

    const addQueryParam = () => {
        setEndpoint(prev => ({
            ...prev,
            queryParams: [...prev.queryParams, { key: '', value: '', required: false }]
        }));
    };

    const updateQueryParam = (index, field, value) => {
        setEndpoint(prev => ({
            ...prev,
            queryParams: prev.queryParams.map((param, i) => 
                i === index ? { ...param, [field]: value } : param
            )
        }));
    };

    const removeQueryParam = (index) => {
        setEndpoint(prev => ({
            ...prev,
            queryParams: prev.queryParams.filter((_, i) => i !== index)
        }));
    };

    const addHeader = () => {
        setEndpoint(prev => ({
            ...prev,
            headers: [...prev.headers, { key: '', value: '', required: false }]
        }));
    };

    const updateHeader = (index, field, value) => {
        setEndpoint(prev => ({
            ...prev,
            headers: prev.headers.map((header, i) => 
                i === index ? { ...header, [field]: value } : header
            )
        }));
    };

    const removeHeader = (index) => {
        setEndpoint(prev => ({
            ...prev,
            headers: prev.headers.filter((_, i) => i !== index)
        }));
    };

// Utility function for exporting API configurations.
const exportConfig = (format, endpoint, forTest = false) => {
    let content;
    let filename;

    switch (format) {
        case 'json':
            content = JSON.stringify(endpoint, null, 2);
            filename = 'api-config.json';
            break;
        case 'postman':
            content = JSON.stringify({
                info: { name: 'API Builder Studio Collection' },
                item: [{
                    name: `${endpoint.method} ${endpoint.path}`,
                    request: {
                        method: endpoint.method,
                        header: endpoint.headers.map(h => ({ key: h.key, value: h.value })),
                        url: {
                            raw: `${endpoint.baseUrl}${endpoint.path}`,
                            host: [endpoint.baseUrl.replace('https://', '').replace('http://', '')],
                            path: endpoint.path.split('/').filter(Boolean)
                        },
                        body: endpoint.method !== 'GET' ? {
                            mode: 'raw',
                            raw: endpoint.body
                        } : undefined
                    }
                }]
            }, null, 2);
            filename = 'postman-collection.json';
            break;
        case 'openapi':
            content = JSON.stringify({
                openapi: '3.0.0',
                info: { title: 'API Builder Studio', version: '1.0.0' },
                paths: {
                    [endpoint.path]: {
                        [endpoint.method.toLowerCase()]: {
                            summary: `${endpoint.method} ${endpoint.path}`,
                            parameters: endpoint.queryParams.map(p => ({
                                name: p.key,
                                in: 'query',
                                required: p.required,
                                schema: { type: 'string' }
                            })),
                            responses: {
                                '200': {
                                    description: 'Success',
                                    content: {
                                        'application/json': {
                                            schema: { type: 'object' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, null, 2);
            filename = 'openapi-spec.json';
            break;
    }

    if (forTest) {
        return { content, filename };
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

    const getFullUrl = () => {
        const params = endpoint.queryParams
            .filter(p => p.key && p.value)
            .map(p => `${p.key}=${p.value}`)
            .join('&');
        return `${endpoint.baseUrl}${endpoint.path}${params ? `?${params}` : ''}`;
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <Header />
            <div className="flex flex-1"> {/* Main flex container for sidebar + content */}
                <Sidebar 
                    commonApis={commonApis} 
                    selectedApiName={selectedApiName} 
                    onSelectApi={setSelectedApiName} 
                />
                <div className="flex-1 overflow-auto px-6 py-8"> {/* Main content area */}
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <EndpointBuilder 
                                    endpoint={endpoint}
                                    setEndpoint={setEndpoint}
                                    addQueryParam={addQueryParam}
                                    updateQueryParam={updateQueryParam}
                                    removeQueryParam={removeQueryParam}
                                    addHeader={addHeader}
                                    updateHeader={updateHeader}
                                    removeHeader={removeHeader}
                                    getFullUrl={getFullUrl}
                                    sendRequest={sendRequest}
                                    isLoading={isLoading}
                                />
                            </div>
                            <div className="space-y-6">
                                <ResponsePreview 
                                    response={response}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    mockResponse={mockResponse}
                                    setMockResponse={setMockResponse}
                                    requestHistory={requestHistory}
                                    loadFromHistory={loadFromHistory}
                                    clearHistory={clearHistory}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Header Component
function Header() {
    return (
        <header className="bg-white border-b border-outline/20 shadow-md3">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-md3 flex items-center justify-center">
                            <span className="material-icons text-white">api</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">API Builder Studio</h1>
                            <p className="text-sm text-secondary">Build and test APIs without backend code</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <MaterialButton variant="text" size="small">
                            <span className="material-icons mr-2">help_outline</span>
                            Docs
                        </MaterialButton>
                        <MaterialButton variant="filled" size="small">
                            <span className="material-icons mr-2">login</span>
                            Sign In
                        </MaterialButton>
                    </div>
                </div>
            </div>
        </header>
    );
}

// Sidebar Component
function Sidebar({ commonApis, selectedApiName, onSelectApi }) {
    /* @tweakable sidebar width */
    const sidebarWidth = '280px';
    /* @tweakable background color for the sidebar */
    const sidebarBgColor = 'bg-surface-variant';
    /* @tweakable text color for active sidebar item */
    const activeItemTextColor = 'text-primary';
    /* @tweakable background color for active sidebar item */
    const activeItemBgColor = 'bg-primary/10';
    /* @tweakable text color for inactive sidebar item */
    const inactiveItemTextColor = 'text-gray-700';
    /* @tweakable hover background color for inactive sidebar item */
    const hoverItemBgColor = 'hover:bg-primary/5';

    return (
        <div className={`flex-shrink-0 w-[${sidebarWidth}] ${sidebarBgColor} border-r border-outline/20 p-4 space-y-4 shadow-md3-elevated overflow-y-auto`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common APIs</h3>
            {Object.entries(commonApis).map(([category, apis]) => (
                <div key={category} className="space-y-2 mb-4">
                    <h4 className="text-md font-semibold text-gray-700 mt-4 mb-2">{category}</h4>
                    {apis.map((api) => (
                        <button
                            key={api.name}
                            onClick={() => onSelectApi(api.name)}
                            className={`
                                w-full text-left px-4 py-2 rounded-md transition-colors duration-200
                                ${selectedApiName === api.name
                                    ? `${activeItemBgColor} ${activeItemTextColor} font-medium`
                                    : `${inactiveItemTextColor} ${hoverItemBgColor}`
                                }
                            `}
                        >
                            {api.name}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Endpoint Builder Component
function EndpointBuilder({ 
    endpoint, 
    setEndpoint, 
    addQueryParam, 
    updateQueryParam, 
    removeQueryParam,
    addHeader,
    updateHeader,
    removeHeader,
    getFullUrl,
    sendRequest,
    isLoading
}) {
    return (
        <MaterialCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Endpoint Configuration</h2>
                <ExportDropdown endpoint={endpoint} />
            </div>

            <div className="space-y-6">
                {/* Method and URL */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MaterialSelect
                        label="Method"
                        value={endpoint.method}
                        onChange={(e) => setEndpoint(prev => ({ ...prev, method: e.target.value }))}
                        options={[
                            { value: 'GET', label: 'GET' },
                            { value: 'POST', label: 'POST' },
                            { value: 'PUT', label: 'PUT' },
                            { value: 'DELETE', label: 'DELETE' }
                        ]}
                    />
                    <MaterialInput
                        label="Base URL"
                        value={endpoint.baseUrl}
                        onChange={(e) => setEndpoint(prev => ({ ...prev, baseUrl: e.target.value }))}
                        placeholder="https://api.example.com"
                        className="md:col-span-3"
                    />
                </div>

                {/* Path */}
                <MaterialInput
                    label="Path"
                    value={endpoint.path}
                    onChange={(e) => setEndpoint(prev => ({ ...prev, path: e.target.value }))}
                    placeholder="/users/:id"
                />

                {/* URL Preview */}
                <div className="bg-surface-variant rounded-md3 p-4">
                    <div className="text-sm font-medium text-secondary mb-2">Full URL Preview:</div>
                    <div className="font-mono text-sm text-primary break-all">{getFullUrl()}</div>
                </div>

                {/* Query Parameters */}
                <QueryParamsSection
                    queryParams={endpoint.queryParams}
                    addQueryParam={addQueryParam}
                    updateQueryParam={updateQueryParam}
                    removeQueryParam={removeQueryParam}
                />

                {/* Headers */}
                <HeadersSection
                    headers={endpoint.headers}
                    addHeader={addHeader}
                    updateHeader={updateHeader}
                    removeHeader={removeHeader}
                />

                {/* Body (for POST/PUT) */}
                {['POST', 'PUT'].includes(endpoint.method) && (
                    <BodySection
                        body={endpoint.body}
                        bodyType={endpoint.bodyType}
                        setEndpoint={setEndpoint}
                    />
                )}

                {/* Settings */}
                <SettingsSection endpoint={endpoint} setEndpoint={setEndpoint} />

                {/* Send Request Button */}
                <MaterialButton
                    variant="filled"
                    size="large"
                    onClick={sendRequest}
                    disabled={isLoading}
                    className="w-full"
                    icon={isLoading ? null : "send"}
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Sending...</span>
                        </div>
                    ) : (
                        'Send Request'
                    )}
                </MaterialButton>
            </div>
        </MaterialCard>
    );
}

// Query Parameters Section
function QueryParamsSection({ queryParams, addQueryParam, updateQueryParam, removeQueryParam }) {
    const MotionDiv = motion.div || 'div';
    
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Query Parameters</h3>
                <MaterialButton variant="text" size="small" onClick={addQueryParam} icon="add">
                    Add Parameter
                </MaterialButton>
            </div>
            <div className="space-y-3">
                {AnimatePresence && (
                    <AnimatePresence>
                        {queryParams.map((param, index) => (
                            <MotionDiv
                                key={index}
                                initial={motion.div ? { opacity: 0, y: -10 } : undefined}
                                animate={motion.div ? { opacity: 1, y: 0 } : undefined}
                                exit={motion.div ? { opacity: 0, y: -10 } : undefined}
                                className="grid grid-cols-5 gap-3 items-end"
                            >
                                <MaterialInput
                                    label="Key"
                                    value={param.key}
                                    onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                                    placeholder="parameter"
                                />
                                <MaterialInput
                                    label="Value"
                                    value={param.value}
                                    onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                                    placeholder="value"
                                />
                                <div className="flex items-center h-12">
                                    <MaterialSwitch
                                        checked={param.required}
                                        onChange={(checked) => updateQueryParam(index, 'required', checked)}
                                        label="Required"
                                    />
                                </div>
                                <MaterialButton
                                    variant="text"
                                    size="small"
                                    onClick={() => removeQueryParam(index)}
                                    className="text-error hover:bg-error/10"
                                    icon="delete"
                                />
                            </MotionDiv>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

// Headers Section
function HeadersSection({ headers, addHeader, updateHeader, removeHeader }) {
    const MotionDiv = motion.div || 'div';
    
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Headers</h3>
                <MaterialButton variant="text" size="small" onClick={addHeader} icon="add">
                    Add Header
                </MaterialButton>
            </div>
            <div className="space-y-3">
                {AnimatePresence && (
                    <AnimatePresence>
                        {headers.map((header, index) => (
                            <MotionDiv
                                key={index}
                                initial={motion.div ? { opacity: 0, y: -10 } : undefined}
                                animate={motion.div ? { opacity: 1, y: 0 } : undefined}
                                exit={motion.div ? { opacity: 0, y: -10 } : undefined}
                                className="grid grid-cols-5 gap-3 items-end"
                            >
                                <MaterialInput
                                    label="Header"
                                    value={header.key}
                                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                    placeholder="Content-Type"
                                />
                                <MaterialInput
                                    label="Value"
                                    value={header.value}
                                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                    placeholder="application/json"
                                />
                                <div className="flex items-center h-12">
                                    <MaterialSwitch
                                        checked={header.required}
                                        onChange={(checked) => updateHeader(index, 'required', checked)}
                                        label="Required"
                                    />
                                </div>
                                <MaterialButton
                                    variant="text"
                                    size="small"
                                    onClick={() => removeHeader(index)}
                                    className="text-error hover:bg-error/10"
                                    icon="delete"
                                />
                            </MotionDiv>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

// Body Section
function BodySection({ body, bodyType, setEndpoint }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Body</h3>
            <div className="space-y-4">
                <MaterialSelect
                    label="Body Type"
                    value={bodyType}
                    onChange={(e) => setEndpoint(prev => ({ ...prev, bodyType: e.target.value }))}
                    options={[
                        { value: 'json', label: 'JSON' },
                        { value: 'form-data', label: 'Form Data' },
                        { value: 'x-www-form-urlencoded', label: 'URL Encoded' }
                    ]}
                />
                <MaterialInput
                    label="Body Content"
                    value={body}
                    onChange={(e) => setEndpoint(prev => ({ ...prev, body: e.target.value }))}
                    placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : 'key=value&key2=value2'}
                    multiline
                    rows={6}
                />
            </div>
        </div>
    );
}

// Settings Section
function SettingsSection({ endpoint, setEndpoint }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
                <MaterialSwitch
                    checked={endpoint.corsEnabled}
                    onChange={(checked) => setEndpoint(prev => ({ ...prev, corsEnabled: checked }))}
                    label="Enable CORS"
                />
                <MaterialSwitch
                    checked={endpoint.cacheEnabled}
                    onChange={(checked) => setEndpoint(prev => ({ ...prev, cacheEnabled: checked }))}
                    label="Enable Caching"
                />
                {endpoint.cacheEnabled && (
                    <div className="ml-6">
                        <MaterialInput
                            label="Cache TTL (seconds)"
                            type="number"
                            value={endpoint.cacheTtl}
                            onChange={(e) => setEndpoint(prev => ({ ...prev, cacheTtl: parseInt(e.target.value) }))}
                            className="w-48"
                        />
                    </div>
                )}
                <MaterialSwitch
                    checked={endpoint.authRequired}
                    onChange={(checked) => setEndpoint(prev => ({ ...prev, authRequired: checked }))}
                    label="Require Authentication"
                />
                <MaterialSelect
                    label="Output Format"
                    value={endpoint.outputFormat}
                    onChange={(e) => setEndpoint(prev => ({ ...prev, outputFormat: e.target.value }))}
                    options={[
                        { value: 'json', label: 'JSON' },
                        { value: 'xml', label: 'XML' },
                        { value: 'csv', label: 'CSV' }
                    ]}
                    className="w-48"
                />
            </div>
        </div>
    );
}

// Export Dropdown
function ExportDropdown({ endpoint }) {
    const [isOpen, setIsOpen] = useState(false);
    const MotionDiv = motion.div || 'div';

    const handleExport = (format) => {
        exportConfig(format, endpoint);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <MaterialButton
                variant="outlined"
                size="small"
                onClick={() => setIsOpen(!isOpen)}
                icon="file_download"
            >
                Export
            </MaterialButton>
            {AnimatePresence && (
                <AnimatePresence>
                    {isOpen && (
                        <MotionDiv
                            initial={motion.div ? { opacity: 0, y: -10 } : undefined}
                            animate={motion.div ? { opacity: 1, y: 0 } : undefined}
                            exit={motion.div ? { opacity: 0, y: -10 } : undefined}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-md3 shadow-md3-elevated z-10 border border-outline/20"
                        >
                            <div className="py-2">
                                <button
                                    onClick={() => handleExport('json')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-surface-variant"
                                >
                                    <span className="material-icons mr-3 text-sm">code</span>
                                    JSON Configuration
                                </button>
                                <button
                                    onClick={() => handleExport('postman')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-surface-variant"
                                >
                                    <span className="material-icons mr-3 text-sm">api</span>
                                    Postman Collection
                                </button>
                                <button
                                    onClick={() => handleExport('openapi')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-surface-variant"
                                >
                                    <span className="material-icons mr-3 text-sm">description</span>
                                    OpenAPI Spec
                                </button>
                            </div>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

// Response Preview Component
function ResponsePreview({ response, activeTab, setActiveTab, mockResponse, setMockResponse, requestHistory, loadFromHistory, clearHistory }) {
    /* @tweakable Whether to show response status and time details */
    const showResponseDetails = true;

    return (
        <MaterialCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Response Preview</h2>
                <div className="flex bg-surface-variant rounded-md3 p-1">
                    <TabButton
                        active={activeTab === 'raw'}
                        onClick={() => setActiveTab('raw')}
                        label="Raw"
                        icon="code"
                    />
                    <TabButton
                        active={activeTab === 'tree'}
                        onClick={() => setActiveTab('tree')}
                        label="Tree"
                        icon="account_tree"
                    />
                    <TabButton
                        active={activeTab === 'schema'}
                        onClick={() => setActiveTab('schema')}
                        label="Schema"
                        icon="schema"
                    />
                    <TabButton
                        active={activeTab === 'mock'}
                        onClick={() => setActiveTab('mock')}
                        label="Mock"
                        icon="edit"
                    />
                     <TabButton
                        active={activeTab === 'history'}
                        onClick={() => setActiveTab('history')}
                        label="History"
                        icon="history"
                    />
                    <TabButton
                        active={activeTab === 'monitoring'}
                        onClick={() => setActiveTab('monitoring')}
                        label="Monitoring"
                        icon="monitor"
                    />
                </div>
            </div>

            {response && showResponseDetails && (
                <div className="mb-6 p-4 bg-surface-variant rounded-md3">
                    <div className="flex items-center space-x-4">
                        <MaterialChip
                            label={`${response.status} ${response.statusText}`}
                            color={response.status >= 200 && response.status < 300 ? 'primary' : 'error'}
                        />
                        <div className="flex items-center space-x-2 text-sm text-secondary">
                            <span className="material-icons text-sm">schedule</span>
                            <span>{response.responseTime}ms</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-[400px]">
                {activeTab === 'raw' && (
                    <RawView data={response?.data || mockResponse} />
                )}
                {activeTab === 'tree' && (
                    <TreeView data={response?.data || mockResponse} />
                )}
                {activeTab === 'schema' && (
                    <SchemaView data={response?.data || mockResponse} />
                )}
                {activeTab === 'mock' && (
                    <MockEditor mockResponse={mockResponse} setMockResponse={setMockResponse} />
                )}
                {activeTab === 'history' && (
                    <HistoryView 
                        requestHistory={requestHistory} 
                        loadFromHistory={loadFromHistory} 
                        clearHistory={clearHistory} 
                    />
                )}
                {activeTab === 'monitoring' && (
                    <MonitoringView />
                )}
            </div>
        </MaterialCard>
    );
}

// Tab Button Component
function TabButton({ active, onClick, label, icon }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${active
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }
            `}
        >
            <span className="material-icons mr-2 text-sm">{icon}</span>
            {label}
        </button>
    );
}

// Raw View Component
function RawView({ data }) {
    const jsonString = JSON.stringify(data, null, 2);
    
    return (
        <div className="bg-gray-900 rounded-md3 p-4 overflow-auto max-h-96">
            <pre className="text-sm text-gray-100 font-mono">
                <code>{jsonString}</code>
            </pre>
        </div>
    );
}

// Tree View Component
function TreeView({ data }) {
    const renderValue = (value, key, depth = 0) => {
        const indent = depth * 20;
        
        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                return (
                    <div key={key} style={{ marginLeft: `${indent}px` }}>
                        <JsonNode 
                            nodeKey={key} 
                            value={`Array(${value.length})`}
                            isExpandable={true}
                            icon="data_array"
                        >
                            {value.map((item, index) => renderValue(item, index, depth + 1))}
                        </JsonNode>
                    </div>
                );
            } else {
                return (
                    <div key={key} style={{ marginLeft: `${indent}px` }}>
                        <JsonNode 
                            nodeKey={key} 
                            value="Object"
                            isExpandable={true}
                            icon="data_object"
                        >
                            {Object.entries(value).map(([k, v]) => renderValue(v, k, depth + 1))}
                        </JsonNode>
                    </div>
                );
            }
        } else {
            return (
                <div key={key} style={{ marginLeft: `${indent}px` }}>
                    <JsonNode 
                        nodeKey={key} 
                        value={JSON.stringify(value)}
                        isExpandable={false}
                        icon="label"
                    />
                </div>
            );
        }
    };

    return (
        <div className="json-tree bg-surface-variant rounded-md3 p-4 overflow-auto max-h-96">
            {renderValue(data, 'root')}
        </div>
    );
}

// JSON Node Component
function JsonNode({ nodeKey, value, isExpandable, children, icon }) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div>
            <div 
                className={`flex items-center space-x-2 py-1 ${isExpandable ? 'cursor-pointer hover:bg-surface rounded' : ''}`}
                onClick={() => isExpandable && setIsExpanded(!isExpanded)}
            >
                {isExpandable && (
                    <span className="material-icons text-sm text-gray-500">
                        {isExpanded ? 'expand_more' : 'chevron_right'}
                    </span>
                )}
                <span className="material-icons text-sm text-primary">{icon}</span>
                <span className="text-primary font-medium">{nodeKey}:</span>
                <span className="text-gray-700">{value}</span>
            </div>
            {isExpandable && isExpanded && (
                <div className="ml-4 border-l-2 border-outline/20 pl-4">
                    {children}
                </div>
            )}
        </div>
    );
}

// Mock Editor Component
function MockEditor({ mockResponse, setMockResponse }) {
    const [jsonString, setJsonString] = useState(JSON.stringify(mockResponse, null, 2));

    const handleUpdate = () => {
        try {
            const parsed = JSON.parse(jsonString);
            setMockResponse(parsed);
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Mock Response Editor</h3>
                <MaterialButton variant="filled" size="small" onClick={handleUpdate} icon="update">
                    Update Mock
                </MaterialButton>
            </div>
            <MaterialInput
                label="Mock JSON Response"
                value={jsonString}
                onChange={(e) => setJsonString(e.target.value)}
                placeholder="Enter your mock JSON response here..."
                multiline
                rows={20}
            />
        </div>
    );
}

// Utility function for inferring a JSON schema from an object.
const inferSchema = (obj, maxDepth = 5, depth = 0) => {
    if (depth > maxDepth) {
        return { type: 'string', description: 'Maximum depth reached, schema truncated.' };
    }

    if (obj === null) {
        return { type: 'null' };
    }

    const type = typeof obj;
    if (type === 'boolean' || type === 'number' || type === 'string') {
        return { type: type };
    }

    if (Array.isArray(obj)) {
        const itemsSchema = obj.length > 0 ? inferSchema(obj[0], maxDepth, depth + 1) : {};
        return { type: 'array', items: itemsSchema };
    }

    if (type === 'object') {
        const properties = {};
        const required = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                properties[key] = inferSchema(obj[key], maxDepth, depth + 1);
                // For simplicity, consider all present fields as 'required' in a basic inference
                required.push(key);
            }
        }
        return { type: 'object', properties, required: required.length > 0 ? required : undefined };
    }

    return { type: 'unknown' };
};


// New SchemaView Component
function SchemaView({ data }) {
    /* @tweakable maximum depth for schema inference */
    const maxSchemaDepth = 5;

    const schema = inferSchema(data, maxSchemaDepth);
    const schemaString = JSON.stringify(schema, null, 2);

    return (
        <div className="bg-gray-900 rounded-md3 p-4 overflow-auto max-h-96">
            <pre className="text-sm text-gray-100 font-mono">
                <code>{schemaString}</code>
            </pre>
        </div>
    );
}

// New HistoryView Component
function HistoryView({ requestHistory, loadFromHistory, clearHistory }) {
    /* @tweakable Text color for successful history items */
    const successHistoryColor = 'text-success';
    /* @tweakable Text color for error history items */
    const errorHistoryColor = 'text-error';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Request History</h3>
                <MaterialButton variant="outlined" size="small" onClick={clearHistory} icon="clear_all">
                    Clear History
                </MaterialButton>
            </div>
            {requestHistory.length === 0 ? (
                <p className="text-secondary text-center py-8">No requests in history yet. Send a request to see it appear here!</p>
            ) : (
                <div className="space-y-3">
                    {requestHistory.map((item, index) => (
                        <MaterialCard key={index} className="p-4 flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-lg">
                                    <span className={`${item.response.status >= 200 && item.response.status < 300 ? successHistoryColor : errorHistoryColor}`}>
                                        {item.response.status}
                                    </span>
                                    <span className="ml-2 text-primary">{item.endpointConfig.method}</span>
                                    <span className="ml-2 text-gray-900">{item.endpointConfig.path}</span>
                                </div>
                                <div className="text-sm text-secondary mt-1">
                                    <span>{item.timestamp}</span>
                                    <span className="ml-4">Response Time: {item.response.responseTime}ms</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <MaterialButton variant="outlined" size="small" onClick={() => loadFromHistory(index)} icon="replay">
                                    Load
                                </MaterialButton>
                            </div>
                        </MaterialCard>
                    ))}
                </div>
            )}
        </div>
    );
}

// New MonitoringView Component
function MonitoringView() {
    /* @tweakable Color for online connection status */
    const connectionStatusOnlineColor = 'bg-success';
    /* @tweakable Color for offline connection status */
    const connectionStatusOfflineColor = 'bg-error';
    /* @tweakable Max number of error log entries to display */
    const maxErrorLogEntries = 10;
    /* @tweakable Interval in milliseconds for updating simulated monitoring data */
    const simulatedDataUpdateIntervalMs = 5000;
    /* @tweakable Success rate percentage threshold for "good" status */
    const simulatedSuccessRateThreshold = 95;
    /* @tweakable Latency threshold in milliseconds for "good" status */
    const simulatedLatencyThresholdMs = 200;
    /* @tweakable array of possible error messages for simulation */
    const possibleErrorMessages = [
        "Authentication failed (401)",
        "Resource not found (404)",
        "Internal server error (500)",
        "Gateway timeout (504)",
        "Rate limit exceeded (429)",
        "Bad request (400)",
        "Database connection lost"
    ];
    /* @tweakable Percentage chance of an error occurring in simulated data (0-100) */
    const simulatedErrorChancePercent = 10;
    /* @tweakable Percentage chance of maintenance mode being active (0-100) */
    const simulatedMaintenanceChancePercent = 5;

    const [connectionStatus, setConnectionStatus] = useState('Online'); // 'Online' | 'Offline'
    const [errorLogs, setErrorLogs] = useState([]);
    const [trafficMetrics, setTrafficMetrics] = useState({
        totalRequests: 0,
        successRate: 100,
        errorRate: 0
    });
    const [latency, setLatency] = useState(0);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const generateSimulatedData = () => {
        // Simulate connection status
        setConnectionStatus(Math.random() < 0.95 ? 'Online' : 'Offline');

        // Simulate error logs
        if (Math.random() * 100 < simulatedErrorChancePercent) {
            const errorMessage = possibleErrorMessages[Math.floor(Math.random() * possibleErrorMessages.length)];
            setErrorLogs(prev => [`[${new Date().toLocaleTimeString()}] ERROR: ${errorMessage}`, ...prev].slice(0, maxErrorLogEntries));
        }

        // Simulate traffic metrics
        setTrafficMetrics(prev => {
            const newTotalRequests = prev.totalRequests + Math.floor(Math.random() * 10) + 1;
            const newSuccessCount = Math.floor(newTotalRequests * (0.90 + Math.random() * 0.1)); // 90-100% success
            const newErrorCount = newTotalRequests - newSuccessCount;
            const newSuccessRate = (newSuccessCount / newTotalRequests * 100).toFixed(2);
            const newErrorRate = (newErrorCount / newTotalRequests * 100).toFixed(2);
            return {
                totalRequests: newTotalRequests,
                successRate: parseFloat(newSuccessRate),
                errorRate: parseFloat(newErrorRate)
            };
        });

        // Simulate latency
        setLatency(Math.floor(Math.random() * 500) + 50); // 50ms - 550ms

        // Simulate maintenance mode
        setMaintenanceMode(Math.random() * 100 < simulatedMaintenanceChancePercent);
    };

    useEffect(() => {
        generateSimulatedData(); // Initial data load
        const interval = setInterval(generateSimulatedData, simulatedDataUpdateIntervalMs);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">API Health & Monitoring</h3>

            {/* Overall Status */}
            <MaterialCard className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${connectionStatus === 'Online' ? connectionStatusOnlineColor : connectionStatusOfflineColor}`}></div>
                    <span className="text-lg font-medium">Connection Status: {connectionStatus}</span>
                </div>
                {maintenanceMode && (
                    <MaterialChip label="Under Scheduled Maintenance" color="tertiary" />
                )}
            </MaterialCard>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MaterialCard className="p-4 text-center">
                    <div className="text-sm text-secondary">Total Requests</div>
                    <div className="text-3xl font-bold text-primary mt-2">{trafficMetrics.totalRequests}</div>
                </MaterialCard>
                <MaterialCard className="p-4 text-center">
                    <div className="text-sm text-secondary">Success Rate</div>
                    <div className={`text-3xl font-bold mt-2 ${trafficMetrics.successRate >= simulatedSuccessRateThreshold ? 'text-success' : 'text-error'}`}>
                        {trafficMetrics.successRate}%
                    </div>
                </MaterialCard>
                <MaterialCard className="p-4 text-center">
                    <div className="text-sm text-secondary">Average Latency</div>
                    <div className={`text-3xl font-bold mt-2 ${latency <= simulatedLatencyThresholdMs ? 'text-success' : 'text-tertiary'}`}>
                        {latency}ms
                    </div>
                </MaterialCard>
            </div>

            {/* Error Log */}
            <MaterialCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Error Log</h4>
                    <MaterialButton variant="text" size="small" onClick={() => setErrorLogs([])} icon="delete">
                        Clear Log
                    </MaterialButton>
                </div>
                <div className="bg-gray-900 rounded-md3 p-4 overflow-auto max-h-64">
                    {errorLogs.length === 0 ? (
                        <p className="text-gray-400 text-sm">No errors logged.</p>
                    ) : (
                        <ul className="space-y-2">
                            {errorLogs.map((log, index) => (
                                <li key={index} className="text-red-300 text-xs font-mono break-words">
                                    {log}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </MaterialCard>

            {/* General Maintenance Section (Placeholder for more controls) */}
            <MaterialCard className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">General Maintenance</h4>
                <div className="space-y-4">
                    <MaterialSwitch
                        checked={maintenanceMode}
                        onChange={setMaintenanceMode}
                        label="Toggle Maintenance Mode"
                    />
                    <p className="text-sm text-secondary">
                        {maintenanceMode 
                            ? /* @tweakable maintenance mode active message */ "API is currently in maintenance mode. Requests may be delayed or return errors."
                            : /* @tweakable maintenance mode inactive message */ "API is operating normally. Maintenance mode is off."
                        }
                    </p>
                    <MaterialButton variant="outlined" size="medium" icon="build">
                        Run Diagnostics (Simulated)
                    </MaterialButton>
                </div>
            </MaterialCard>
        </div>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root-container'));
