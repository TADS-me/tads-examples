import React, { useState } from "react";
import { TadsWidget, renderTadsWidget } from 'react-tads-widget';
import { Page } from '@/components/Page.tsx';
import { Button } from '@telegram-apps/telegram-ui';
import { useUserStats } from '@/hooks/useUserStats';
import { usePageBackground } from '@/hooks/usePageBackground';

// Styles for TADS ads
import "./AdsPage.css";

const AdsPage: React.FC = () => {
    const { updateCoins, coins } = useUserStats();
    const [isWatchingAd, setIsWatchingAd] = useState(false);
    const [lastReward, setLastReward] = useState<{ type: string; amount: number } | null>(null);
    
    // Set green background for ads page
    usePageBackground('green');

      // Callback for reward when clicking on ad
  const rewardUserByClick = () => {
        console.log("User rewarded for clicking ad");
        const rewardAmount = 10;
        updateCoins(rewardAmount);
        setLastReward({ type: 'click', amount: rewardAmount });
        
        // Show reward notification
        setTimeout(() => setLastReward(null), 3000);
    };

      // Callback if ads are not found
  const onAdsNotFound = () => {
        console.log("No ads found for this user");
        alert("😔 No ads available at the moment. Please try again later!");
    };

    const rewardUserByShow = () => {
        console.log("User rewarded for watching fullscreen ad");
        const rewardAmount = 10;
        updateCoins(rewardAmount);
        setIsWatchingAd(false);
        setLastReward({ type: 'video', amount: rewardAmount });
        
        // Show reward notification
        setTimeout(() => setLastReward(null), 3000);
    };

    // Show fullscreen ad
    const showFullScreenAd = () => {
        setIsWatchingAd(true);
        renderTadsWidget({ 
            id: '4', 
            type: 'fullscreen',
        });
    };

    return (
        <Page back={true}>
            <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-700 to-green-800 overflow-y-auto">
                {/* Заголовок */}
                <div className="text-center pt-8 pb-6 px-4">
                    <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                        🎯 Earn Coins
                    </h1>
                    <p className="text-white/90 text-lg mb-4">
                        Interact with ads and earn coins to play more games!
                    </p>
                    
                    {/* Счетчик монет */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                        <span className="text-2xl">🪙</span>
                        <span className="text-white font-bold text-xl">{coins}</span>
                        <span className="text-white/80 text-sm">coins</span>
                    </div>
                </div>

                {/* Уведомление о награде */}
                {lastReward && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
                        <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                            <span className="text-xl">🎉</span>
                            <span className="font-semibold">
                                +{lastReward.amount} coins for {lastReward.type === 'click' ? 'clicking' : 'watching'} ad!
                            </span>
                        </div>
                    </div>
                )}

                {/* Основной контент */}
                <div className="max-w-2xl mx-auto space-y-6 px-4 pb-8">
                    
                    {/* Блок с клик-рекламой */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                        <div className="text-left mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Click & Earn</h2>
                            <p className="text-white/80 mb-4">
                                Click on the ad below to earn <span className="font-bold text-yellow-300">10 coins</span>
                            </p>
                            {/* <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 inline-block">
                                <span className="text-yellow-300 font-semibold">💰 Reward: +10 coins per click</span>
                            </div> */}
                        </div>
                        
                        <div className="rounded-xl mb-4 overflow-hidden">
                            <TadsWidget 
                                id="1" 
                                type="static" 
                                debug={true}
                                onClickReward={rewardUserByClick}
                                onAdsNotFound={onAdsNotFound}
                            />
                        </div>
                        
                        <div className="text-left">
                            <p className="text-white/70 text-sm">
                                💡 Tip: Click on the ad to earn coins instantly!
                            </p>
                        </div>
                    </div>

                    {/* Блок с видео рекламой */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                        <div className="text-left mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Watch & Earn</h2>
                            <p className="text-white/80 mb-4">
                                Watch a full screen banner ad to earn <span className="font-bold text-yellow-300">10 coins</span>
                            </p>
                            {/* <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 inline-block">
                                <span className="text-blue-300 font-semibold">🎁 Reward: +10 coins per ads</span>
                            </div> */}
                        </div>
                        
                        <div className="text-left">
                            <Button 
                                onClick={showFullScreenAd}
                                disabled={isWatchingAd}
                                className={`uppercase rounded-lg w-full transition-all duration-200 ${
                                    isWatchingAd 
                                        ? 'bg-gray-500 cursor-not-allowed' 
                                        : ' bg-green-700 text-white '
                                }`}
                            >
                                {isWatchingAd ? 'Watching Ad...' : 'Watch Ad'}
                            </Button>
                            
                            <TadsWidget 
                                id="4" 
                                type="fullscreen" 
                                debug={true} 
                                onAdsNotFound={onAdsNotFound} 
                                onShowReward={rewardUserByShow} 
                            />
                        </div>
                        
                        <div className="text-left mt-4">
                            <p className="text-white/70 text-sm">
                                ⏱️ Ads are usually 10-15 seconds long
                            </p>
                        </div>
                    </div>

                    {/* Информационный блок */}
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="text-left mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Useful Links</h2>
                            <p className="text-white/80">
                                Stay connected and learn more about our project
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {/* Telegram Channel */}
                            <a 
                                href="https://t.me/tadsagency" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white/10 transition-all duration-200 rounded-xl p-4 text-center border border-white/20 flex flex-row gap-x-6"
                            >
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200 p-1 ml-2">📢</div>
                                <div className="flex flex-col text-left">
                                    <h3 className="font-semibold text-white mb-1">Our Telegram Channel</h3>
                                    <p className="text-white/70 text-sm">Latest updates & news</p>
                                </div>
                            </a>

                            {/* Documentation */}
                            <a 
                                href="https://docs.tads.me/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white/10 transition-all duration-200 rounded-xl p-4 text-center border border-white/20 flex flex-row gap-x-6"
                            >
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200 p-1 ml-2">📚</div>
                                <div className="flex flex-col text-left">
                                    <h3 className="font-semibold text-white mb-1">Documentation</h3>
                                    <p className="text-white/70 text-sm">Developer guides & API</p>
                                </div>
                            </a>

                            {/* GitHub */}
                            <a 
                                href="https://github.com/TADS-me/tads-examples" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white/10 transition-all duration-200 rounded-xl p-4 text-center border border-white/20 flex flex-row gap-x-6"
                            >
                                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200 p-1 ml-2">💻</div>
                                <div className="flex flex-col text-left">
                                    <h3 className="font-semibold text-white mb-1">GitHub</h3>
                                    <p className="text-white/70 text-sm">Source code & examples</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default AdsPage;
