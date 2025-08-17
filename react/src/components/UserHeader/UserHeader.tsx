import { type FC, useMemo } from 'react';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { useUserStats } from '@/hooks/useUserStats';

export const UserHeader: FC = () => {
  const initDataState = useSignal(initData.state);
  const { maxScore, coins } = useUserStats();
  
  // Get user data
  const user = useMemo(() => {
    return initDataState?.user;
  }, [initDataState]);

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all duration-300 px-4 sm:px-5 py-3 sm:py-4 rounded-b-2xl sm:rounded-b-3xl shadow-lg hover:shadow-xl mb-4 sm:mb-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-15 sm:h-15 bg-white/20 rounded-full flex items-center justify-center border-2 sm:border-3 border-white/30 shadow-lg">
            <span className="text-lg sm:text-2xl font-bold text-white uppercase">?</span>
          </div>
          <div className="flex-1 text-white">
            <div className="text-base sm:text-lg font-semibold mb-2 text-shadow">Loading...</div>
            <div className="flex gap-2 sm:gap-4 flex-wrap">
              <span className="bg-white/15 hover:bg-white/25 transition-all duration-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 flex items-center gap-1 sm:gap-1.5">
                <span className="opacity-90">🏆</span> 0
              </span>
              <span className="bg-white/15 hover:bg-white/25 transition-all duration-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 flex items-center gap-1 sm:gap-1.5">
                <span className="opacity-90">🪙</span> 0
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all duration-300 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl sm:rounded-3xl shadow-xl mb-4 sm:mb-5 mx-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full overflow-hidden border-2 sm:border-3 border-white/30 shadow-lg">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={user.firstName || user.username || 'User'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/20 flex items-center justify-center">
              <span className="text-lg sm:text-2xl font-bold text-white uppercase">
                {user.firstName?.[0] || user.username?.[0] || '?'}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 text-white">
          <div className="text-base sm:text-lg font-semibold mb-2 text-shadow">
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user.username || 'User'
            }
          </div>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <span className="bg-white/15 hover:bg-white/25 transition-all duration-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 flex items-center gap-1 sm:gap-1.5">
              <span className="opacity-90">🏆</span> {maxScore}
            </span>
            <span className="bg-white/15 hover:bg-white/25 transition-all duration-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 flex items-center gap-1 sm:gap-1.5">
              <span className="opacity-90">🪙</span> {coins}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
