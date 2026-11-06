import { useState, useEffect } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Calendar, CheckCircle, Info, AlertTriangle, Package, Scale } from 'lucide-react';
import { getChartData } from '../lib/store';

const WASTE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const STATUS_COLORS = { pending: '#f59e0b', accepted: '#3b82f6', completed: '#10b981', rejected: '#ef4444' };

export default function DataTracking() {
    const [chartData, setChartData] = useState<ReturnType<typeof getChartData> | null>(null);

    useEffect(() => {
        setChartData(getChartData());
    }, []);

    if (!chartData) return null;

    const { dailyData, wasteDistribution, statusCounts, totalKg, totalEntries } = chartData;
    const hasData = totalEntries > 0;
    const hasRecentData = dailyData.some(d => d.kg > 0);

    const statusData = [
        { name: 'Pending', value: statusCounts.pending, color: STATUS_COLORS.pending },
        { name: 'Accepted', value: statusCounts.accepted, color: STATUS_COLORS.accepted },
        { name: 'Completed', value: statusCounts.completed, color: STATUS_COLORS.completed },
        { name: 'Rejected', value: statusCounts.rejected, color: STATUS_COLORS.rejected },
    ].filter(s => s.value > 0);

    const formatKg = (kg: number) => {
        if (kg >= 1000) return `${(kg / 1000).toFixed(1)}T`;
        return `${kg} kg`;
    };

    const statCards = [
        { label: 'Total Collected', value: formatKg(totalKg), icon: Scale, color: '#10b981' },
        { label: 'Total Records', value: totalEntries, icon: Package, color: '#3b82f6' },
        { label: 'Completed Pickups', value: statusCounts.completed, icon: CheckCircle, color: '#10b981' },
        { label: 'Pending Requests', value: statusCounts.pending, icon: AlertTriangle, color: '#f59e0b' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="page-title" style={{ marginBottom: 0 }}>Operational Data Tracking</h3>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 text-muted" style={{ background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                        <Calendar size={16} />
                        <span style={{ fontSize: '0.85rem' }}>Last 7 Days</span>
                    </div>
                </div>
            </div>

            {!hasData && (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <Info size={48} className="mx-auto mb-4" style={{ opacity: 0.3 }} />
                    <h4 style={{ color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>No Data to Display</h4>
                    <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        Charts will appear here once you start recording pickup activity. Go to the <strong>Pickup</strong> tab to record your first pickup.
                    </p>
                </div>
            )}

            {hasData && (
                <>
                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {statCards.map((card, i) => (
                            <div key={i} className="card" style={{ padding: '1rem 1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
                                        {card.label}
                                    </span>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 8,
                                        background: `${card.color}14`, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <card.icon size={14} color={card.color} />
                                    </div>
                                </div>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f2b3c' }}>{card.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-2">
                        {/* Daily Collection */}
                        <div className="card">
                            <h4 className="card-title">Daily Collection (kg)</h4>
                            <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center">
                                {!hasRecentData ? (
                                    <div className="text-center text-muted">
                                        <Info size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No pickups in the last 7 days.</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer>
                                        <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value: number | undefined) => [`${value ?? 0} kg`, 'Collected']}
                                            />
                                            <Bar dataKey="kg" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected (kg)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Waste Distribution */}
                        <div className="card">
                            <h4 className="card-title">Waste Distribution (kg)</h4>
                            <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center">
                                {wasteDistribution.length === 0 ? (
                                    <div className="text-center text-muted">
                                        <Info size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No waste data yet.</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={wasteDistribution}
                                                cx="50%" cy="50%"
                                                innerRadius={55} outerRadius={80}
                                                paddingAngle={4} dataKey="value"
                                                label={({ name, value }) => `${name}: ${formatKg(value)}`}
                                            >
                                                {wasteDistribution.map((_, index) => (
                                                    <Cell key={"cell-" + index} fill={WASTE_COLORS[index % WASTE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value: number | undefined) => [`${formatKg(value ?? 0)}`, 'Amount']}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Pickups Per Day (count) */}
                        <div className="card">
                            <h4 className="card-title">Pickups Per Day</h4>
                            <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center">
                                {!hasRecentData ? (
                                    <div className="text-center text-muted">
                                        <Info size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No pickups in the last 7 days.</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer>
                                        <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value: number | undefined) => [`${value ?? 0}`, 'Pickups']}
                                            />
                                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pickups" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Request Status */}
                        <div className="card">
                            <h4 className="card-title">Request Status</h4>
                            <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center">
                                {statusData.length === 0 ? (
                                    <div className="text-center text-muted">
                                        <Info size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No customer requests yet.</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%" cy="50%"
                                                innerRadius={55} outerRadius={80}
                                                paddingAngle={4} dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {statusData.map((s, index) => (
                                                    <Cell key={"status-" + index} fill={s.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
