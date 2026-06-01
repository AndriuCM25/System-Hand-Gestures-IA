import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, title, value, subtitle, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'text-primary border-primary/30 bg-primary/5',
    green: 'text-green-400 border-green-400/30 bg-green-400/5',
    yellow: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
    purple: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass-effect border rounded-xl p-6 ${colorClasses[color]} transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{title}</p>
              <h3 className="text-3xl font-bold mt-1">{value}</h3>
            </div>
          </div>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center space-x-2 mt-3">
              <span className={`text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-500">vs último mes</span>
            </div>
          )}
        </div>
      </div>

      {/* Animated border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${color === 'primary' ? '#00d9ff' : color === 'green' ? '#4ade80' : color === 'yellow' ? '#facc15' : '#a855f7'}20, transparent)`,
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};

export default StatsCard;
