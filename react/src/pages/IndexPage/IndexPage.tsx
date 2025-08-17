import { List, Button } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import { UserHeader } from '@/components/UserHeader';
import { useUserStats } from '@/hooks/useUserStats';
import { usePageBackground } from '@/hooks/usePageBackground';

// import tonSvg from './ton.svg';

export const IndexPage: FC = () => {
  const { resetStats, coins } = useUserStats();
  
  // Set green background for main page
  usePageBackground('green');

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      resetStats();
    }
  };

  const canPlayGame = coins >= 10;

  return (
    <Page back={false} className='min-h-screen bg-cover bg-bottom bg-no-repeat pt-4' style={{ backgroundImage: 'url(/bg.jpg)' }}>
      <div>
        <UserHeader />
        <List>
          <div className="pt-10">
            <div className="p-6 mb-6">
              <h2 className="text-5xl font-bold text-white mb-3 text-center">DEMO</h2>
              <p className="text-white text-center text-lg uppercase">TADS integration</p>
              {!canPlayGame && (
                <div className="mt-4 text-center">
                  <p className="text-white/80 text-sm">
                    💡 Need more coins? Click &ldquo;Earn Coins&rdquo; to watch ads and earn coins!
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 items-center justify-center w-48 mx-auto">
              {canPlayGame ? (
                <Link to="/game" className='mx-auto w-full text-center'>
                  <Button className='uppercase rounded-lg bg-green-500 text-white w-full'>Start Game</Button>
                </Link>
              ) : (
                <div className='mx-auto w-full text-center'>
                  <Button 
                    className='uppercase rounded-lg bg-gray-400 text-white w-full cursor-not-allowed' 
                    disabled
                  >
                    Start Game
                  </Button>
                  <p className="text-white/70 text-xs mt-1">You need 10 coins to play</p>
                </div>
              )}
              <Link to="/ads" className='mx-auto w-full text-center'>
                <Button className='uppercase rounded-lg bg-green-500 text-white w-full'>Earn Coins</Button>
              </Link>
              <button 
                onClick={handleResetStats}
                className='uppercase rounded-lg bg-red-600 text-white px-4 py-2 w-full'
              >
                Reset Stats
              </button>
              <a href="https://tads.me/register?utm_source=tads_demo&utm_medium=organic" target="_blank" rel="noopener noreferrer" className='mx-auto w-full text-center'>
                <Button className='uppercase rounded-lg bg-white text-green-700 w-full'>Sign Up TADS</Button>
              </a>
            </div>
          </div>
        </List>
      </div>
    </Page>
  );
};
