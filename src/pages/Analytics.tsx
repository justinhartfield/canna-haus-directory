
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const Analytics = () => {
  // Sample data for charts
  const apiUsageData = [
    { name: 'Jan', Strains: 4000, Medical: 2400, LabData: 1800, Compliance: 1200 },
    { name: 'Feb', Strains: 4200, Medical: 2600, LabData: 2000, Compliance: 1300 },
    { name: 'Mar', Strains: 4800, Medical: 2900, LabData: 2200, Compliance: 1400 },
    { name: 'Apr', Strains: 5200, Medical: 3200, LabData: 2400, Compliance: 1500 },
    { name: 'May', Strains: 5800, Medical: 3400, LabData: 2600, Compliance: 1600 },
    { name: 'Jun', Strains: 6200, Medical: 3700, LabData: 2800, Compliance: 1700 },
    { name: 'Jul', Strains: 6800, Medical: 4000, LabData: 3000, Compliance: 1800 },
  ];
  
  const userActivityData = [
    { name: 'Jan', Reviews: 1200, Searches: 3800, Contributions: 480 },
    { name: 'Feb', Reviews: 1400, Searches: 4200, Contributions: 520 },
    { name: 'Mar', Reviews: 1600, Searches: 4800, Contributions: 580 },
    { name: 'Apr', Reviews: 1800, Searches: 5200, Contributions: 620 },
    { name: 'May', Reviews: 2000, Searches: 5600, Contributions: 680 },
    { name: 'Jun', Reviews: 2200, Searches: 6000, Contributions: 720 },
    { name: 'Jul', Reviews: 2400, Searches: 6400, Contributions: 780 },
  ];
  
  const dataAccuracyData = [
    { name: 'Jan', Accuracy: 92 },
    { name: 'Feb', Accuracy: 94 },
    { name: 'Mar', Accuracy: 93 },
    { name: 'Apr', Accuracy: 95 },
    { name: 'May', Accuracy: 97 },
    { name: 'Jun', Accuracy: 98 },
    { name: 'Jul', Accuracy: 99 },
  ];
  
  const apiDistributionData = [
    { name: 'Strains', value: 45 },
    { name: 'Medical', value: 25 },
    { name: 'Lab Data', value: 15 },
    { name: 'Compliance', value: 10 },
    { name: 'Reviews', value: 5 },
  ];
  
  const COLORS = ['#577F74', '#8FBCAA', '#C4DED9', '#42635A', '#A2C9B5'];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Monitor data usage, accuracy metrics, and platform engagement.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Requests" 
              value="142,854" 
              change="+12.6%" 
              changeType="positive"
            />
            <StatCard 
              title="User Reviews" 
              value="24,129" 
              change="+8.3%" 
              changeType="positive"
            />
            <StatCard 
              title="Data Accuracy" 
              value="99.2%" 
              change="+1.5%" 
              changeType="positive"
            />
            <StatCard 
              title="Active API Users" 
              value="867" 
              change="+15.2%" 
              changeType="positive"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard 
              title="API Endpoint Usage" 
              subtitle="Requests per month by category"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={apiUsageData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Strains" stroke="#577F74" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Medical" stroke="#8FBCAA" strokeWidth={2} />
                  <Line type="monotone" dataKey="LabData" stroke="#C4DED9" strokeWidth={2} />
                  <Line type="monotone" dataKey="Compliance" stroke="#42635A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard 
              title="User Activity" 
              subtitle="Reviews, searches, and contributions"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={userActivityData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                  />
                  <Legend />
                  <Area type="monotone" dataKey="Searches" stackId="1" stroke="#8FBCAA" fill="#8FBCAA" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Reviews" stackId="1" stroke="#577F74" fill="#577F74" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="Contributions" stackId="1" stroke="#42635A" fill="#42635A" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard 
              title="Data Accuracy" 
              subtitle="Monthly accuracy percentage based on verified reviews"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dataAccuracyData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                  />
                  <Bar dataKey="Accuracy" fill="#577F74">
                    {dataAccuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.Accuracy >= 95 ? '#577F74' : '#8FBCAA'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard 
              title="API Usage Distribution" 
              subtitle="Percentage of requests by category"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={apiDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {apiDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Recent API Activity</h2>
              <p className="text-sm text-muted-foreground">
                Recent requests to the API endpoints
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left p-4 font-medium">Timestamp</th>
                    <th className="text-left p-4 font-medium">Endpoint</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Response Time</th>
                    <th className="text-left p-4 font-medium">User</th>
                  </tr>
                </thead>
                <tbody>
                  <ActivityRow 
                    timestamp="2023-07-12 15:42:18" 
                    endpoint="/strains/123" 
                    status="200 OK" 
                    responseTime="112ms" 
                    user="api_user_42" 
                  />
                  <ActivityRow 
                    timestamp="2023-07-12 15:40:55" 
                    endpoint="/medical/search?condition=anxiety" 
                    status="200 OK" 
                    responseTime="245ms" 
                    user="api_user_87" 
                  />
                  <ActivityRow 
                    timestamp="2023-07-12 15:38:12" 
                    endpoint="/reviews" 
                    status="201 Created" 
                    responseTime="189ms" 
                    user="api_user_54" 
                  />
                  <ActivityRow 
                    timestamp="2023-07-12 15:36:44" 
                    endpoint="/lab-data/batch/8765" 
                    status="200 OK" 
                    responseTime="156ms" 
                    user="api_user_29" 
                  />
                  <ActivityRow 
                    timestamp="2023-07-12 15:35:18" 
                    endpoint="/strains?category=Indica" 
                    status="200 OK" 
                    responseTime="203ms" 
                    user="api_user_76" 
                  />
                </tbody>
              </table>
            </div>
            
            <div className="p-4 flex justify-end border-t border-border">
              <button className="text-sm text-cannabis-600 hover:text-cannabis-700 font-medium">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType }) => {
  return (
    <div className="glass-card rounded-xl p-6 hover-card-animation">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <h3 className="text-2xl font-bold mb-2">{value}</h3>
      <div className={cn(
        "text-xs font-medium inline-flex items-center",
        changeType === 'positive' && "text-green-600",
        changeType === 'negative' && "text-red-600",
        changeType === 'neutral' && "text-muted-foreground"
      )}>
        {changeType === 'positive' && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        )}
        {changeType === 'negative' && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
        {change} from last month
      </div>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
      {children}
    </div>
  );
};

interface ActivityRowProps {
  timestamp: string;
  endpoint: string;
  status: string;
  responseTime: string;
  user: string;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ timestamp, endpoint, status, responseTime, user }) => {
  return (
    <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
      <td className="p-4 text-sm">{timestamp}</td>
      <td className="p-4 text-sm">
        <code className="text-xs bg-secondary/50 px-1.5 py-0.5 rounded font-mono">
          {endpoint}
        </code>
      </td>
      <td className="p-4 text-sm">
        <span className={cn(
          "px-2 py-1 rounded-full text-xs",
          status.startsWith('2') ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {status}
        </span>
      </td>
      <td className="p-4 text-sm">{responseTime}</td>
      <td className="p-4 text-sm">{user}</td>
    </tr>
  );
};

export default Analytics;
