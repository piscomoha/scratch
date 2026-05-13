import { useDashboardStats } from '../hooks/useQueries';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { FiUsers, FiUserCheck, FiUserX, FiBriefcase } from 'react-icons/fi';

const Dashboard = () => {
  const { data, isLoading } = useDashboardStats();
  const { user } = useAuth();

  if (isLoading) return <div className="text-center mt-20">Chargement des statistiques...</div>;

  const stats = [
    { label: 'Total Stagiaires', value: data.total_stagiaires, icon: <FiUsers />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Stagiaires Actifs', value: data.actifs, icon: <FiUserCheck />, color: 'bg-green-100 text-green-600' },
    { label: 'Absences (7 jours)', value: data.absences_recentes?.length || 0, icon: <FiUserX />, color: 'bg-red-100 text-red-600' },
    { label: 'En Stage', value: data.en_stage, icon: <FiBriefcase />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Bienvenue sur le portail de suivi, {user?.name}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <span className="text-gray-500 text-sm">Taux de présence global</span>
          <div className="text-2xl font-bold text-secondary">{data.taux_presence_global}%</div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${stat.color} text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-primary mb-6">Présences des 7 derniers jours</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.presences_par_jour} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="jour" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="presents" name="Présents" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {data.presences_par_jour?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#1B3A6B" /> 
                  ))}
                </Bar>
                <Bar dataKey="absents" name="Absents" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {data.presences_par_jour?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#F58220" /> 
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Absences List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Dernières absences</h3>
          <div className="space-y-4">
            {data.absences_recentes?.length > 0 ? (
              data.absences_recentes.map((absence, i) => (
                <div key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
                    {absence.stagiaire.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{absence.stagiaire}</h4>
                    <p className="text-xs text-gray-500 mt-1">{absence.module}</p>
                    <p className="text-xs text-red-500 font-medium mt-1">{absence.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Aucune absence récente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
