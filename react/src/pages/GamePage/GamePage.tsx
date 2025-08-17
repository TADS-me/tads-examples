import React, { useRef, useEffect, useState } from "react";
import { Page } from '@/components/Page.tsx';
import { Link } from '@/components/Link/Link.tsx';
import { useUserStats } from '@/hooks/useUserStats';
import { usePageBackground } from '@/hooks/usePageBackground';
import { renderTadsWidget, TadsWidget } from 'react-tads-widget';
import "./GamePage.css";

interface Platform {
  x: number;
  w: number;
}

interface Stick {
  x: number;
  length: number;
  rotation: number;
}

interface Tree {
  x: number;
  color: string;
}

// Game phases
type Phase = "waiting" | "stretching" | "turning" | "walking" | "transitioning" | "falling";


// Main constants
const platformHeight = 100;
const heroDistanceFromEdge = 10;
const perfectAreaSize = 10;

const stretchingSpeed = 4; 
const turningSpeed = 4; 
const walkingSpeed = 4;
const transitioningSpeed = 2;
const fallingSpeed = 2;

const heroWidth = 17;
const heroHeight = 30;

const backgroundSpeedMultiplier = 0.2;

const hill1BaseHeight = 100;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 70;
const hill2Amplitude = 20;
const hill2Stretch = 0.5;

// Math extensions
// Sine using degrees
const sinus = function(degree: number) {
  return Math.sin((degree / 180) * Math.PI);
};

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { updateMaxScore, updateCoins, coins } = useUserStats();
  
  // Set black background for game page
  usePageBackground('black');
  
  // Displayed score
  const [score, setScore] = useState<number>(0);

  // Game state
  const [gameOver, setGameOver] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [hasPaidForGame, setHasPaidForGame] = useState(false);

  // Game state is stored in useRef to avoid unnecessary re-renders
  const phaseRef = useRef<Phase>("waiting");
  const lastTimestampRef = useRef<number | null>(null);
  
  const heroXRef = useRef<number>(0);
  const heroYRef = useRef<number>(0);
  const sceneOffsetRef = useRef<number>(0);

  const platformsRef = useRef<Platform[]>([]);
  const sticksRef = useRef<Stick[]>([]);
  const treesRef = useRef<Tree[]>([]);

  const canvasSizeRef = useRef<{width: number; height: number}>({width: window.innerWidth, height: window.innerHeight});

  // Initialize game
  useEffect(() => {    
    const handleResize = () => {
      canvasSizeRef.current = { width: window.innerWidth, height: window.innerHeight };
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      draw(); 
    };

    window.addEventListener("resize", handleResize);

    resetGame();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

     handleResize(); // Set dimensions immediately and draw

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line
  }, []);

  // Reset payment flag when component mounts (new game session)
  useEffect(() => {
    setHasPaidForGame(false);
  }, []);

  useEffect(() => {
    if (!gameOver && coins < 10) {
      alert('Not enough coins for the game! You need at least 10 coins.');
      window.location.href = '/';
      return;
    }

    if (gameOver) {
      // Game over, update statistics
      updateMaxScore(score);
      
      // Give bonus coins for high score
      if (score >= 20) {
        updateCoins(5); // +5 coins for 20+ score
      }
      if (score >= 50) {
        updateCoins(10); // +10 coins for 50+ score
      }
      if (score >= 100) {
        updateCoins(25); // +25 coins for 100+ score
      }
    }
  }, [gameOver]);

  // Animation
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
        requestAnimationFrame(animate);
        return;
      }

      const delta = timestamp - lastTimestampRef.current;
      update(delta);
      draw();

      lastTimestampRef.current = timestamp;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  const resetGame = () => {
    // Check if there are enough coins for the game
    if (coins < 10) {
      alert('Not enough coins for the game! You need at least 10 coins.');
      return;
    }
    
    phaseRef.current = "waiting";
    setScore(0);
    setHasPaidForGame(false); // Reset payment flag for new game
    sceneOffsetRef.current = 0;

    // Initial platforms
    // First platform
    platformsRef.current = [{ x: 50, w: 50 }];
    generatePlatform();
    generatePlatform();
    generatePlatform();
    generatePlatform();

    sticksRef.current = [{ x: platformsRef.current[0].x + platformsRef.current[0].w, length: 0, rotation: 0 }];

    treesRef.current = [];
    for (let i = 0; i < 10; i++) {
      generateTree();
    }

    heroXRef.current = platformsRef.current[0].x + platformsRef.current[0].w - heroDistanceFromEdge;
    heroYRef.current = 0;
  };

  // Show fullscreen ad for free restart
  const showAdForRestart = () => {
    setIsWatchingAd(true);
    renderTadsWidget({ 
      id: '4', 
      type: 'fullscreen',
    });
  };

  // Callback for ad reward
  const onAdReward = () => {
    setIsWatchingAd(false);
    updateCoins(10);
    resetGame();
    setGameOver(false);
    setHasPaidForGame(false); // Reset payment flag for free restart
  };

  const generateTree = () => {
    const minimumGap = 30;
    const maximumGap = 150;

    const lastTree = treesRef.current[treesRef.current.length - 1];
    const furthestX = lastTree ? lastTree.x : 0;

    const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
    const treeColors = ["#09400f", "#026e06", "#041305"];
    const color = treeColors[Math.floor(Math.random() * 3)];

    treesRef.current.push({ x, color });
  };

  const generatePlatform = () => {
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    const lastPlatform = platformsRef.current[platformsRef.current.length - 1];
    const furthestX = lastPlatform.x + lastPlatform.w;

    const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
    const w = minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    platformsRef.current.push({ x, w });
  };

  const update = (delta: number) => {
    const phase = phaseRef.current;
    const sticks = sticksRef.current;
    // const heroX = heroXRef.current;
    // const heroY = heroYRef.current;

    switch (phase) {
      case "waiting":
        return;
      case "stretching":
        sticks[sticks.length - 1].length += delta / stretchingSpeed;
        break;
      case "turning":
        sticks[sticks.length - 1].rotation += delta / turningSpeed;
        if (sticks[sticks.length - 1].rotation > 90) {
          sticks[sticks.length - 1].rotation = 90;
          const [nextPlatform, perfectHit] = thePlatformTheStickHits();
          if (nextPlatform) {
            // Increase score
            setScore((prev) => prev + (perfectHit ? 2 : 1));
            if (perfectHit) {
              // PERFECT display can be done through DOM, but we'll skip it for now
            }
            generatePlatform();
            generateTree();
            generateTree();
          }
          phaseRef.current = "walking";
        }
        break;
      case "walking": {
        heroXRef.current += delta / walkingSpeed;
        const [nextPlatform] = thePlatformTheStickHits();
        if (nextPlatform) {
          const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
          if (heroXRef.current > maxHeroX) {
            heroXRef.current = maxHeroX;
            phaseRef.current = "transitioning";
          }
        } else {
          // No platform - hero will fall
          const stick = sticks[sticks.length - 1];
          const maxHeroX = stick.x + stick.length + heroWidth;
          if (heroXRef.current > maxHeroX) {
            heroXRef.current = maxHeroX;
            phaseRef.current = "falling";
            setGameOver(true); // Show that game is over
          }
        }
        break;
      }
      case "transitioning": {
        sceneOffsetRef.current += delta / transitioningSpeed;
        const [nextPlatform] = thePlatformTheStickHits();
        if (nextPlatform) {
          if (sceneOffsetRef.current > nextPlatform.x + nextPlatform.w - 100) {
            // Add next stick
            sticksRef.current.push({ x: nextPlatform.x + nextPlatform.w, length: 0, rotation: 0 });
            phaseRef.current = "waiting";
          }
        }
        break;
      }
      case "falling": {
        const stick = sticks[sticks.length - 1];
        if (stick.rotation < 180) {
          stick.rotation += delta / turningSpeed;
        }
        heroYRef.current += delta / fallingSpeed;
        const maxHeroY = platformHeight + 100 + (canvasSizeRef.current.height - 375)/2;

        if (heroYRef.current > maxHeroY) {
          phaseRef.current = "waiting";
          setGameOver(true); // Show that game is over
        //   resetGame();
        }
        break;
      }
      default:
        break;
    }
  };

  const thePlatformTheStickHits = (): [Platform | undefined, boolean] => {
    const sticks = sticksRef.current;
    if (sticks[sticks.length - 1].rotation !== 90) return [undefined, false];
    const stickFarX = sticks[sticks.length - 1].x + sticks[sticks.length - 1].length;
    const platform = platformsRef.current.find(
      (p) => p.x < stickFarX && stickFarX < p.x + p.w
    );

    if (!platform) return [undefined, false];

    // Check if hit is in the "perfect zone"
    if (
      platform.x + platform.w/2 - perfectAreaSize/2 < stickFarX &&
      stickFarX < platform.x + platform.w/2 + perfectAreaSize/2
    ) {
      return [platform, true];
    }
    return [platform, false];
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvasSizeRef.current.width;
    const height = canvasSizeRef.current.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    drawBackground(ctx);

    // Center the scene
    ctx.translate((width - 375) / 2 - sceneOffsetRef.current, (height - 375) / 2);

    drawPlatforms(ctx);
    drawHero(ctx);
    drawSticks(ctx);

    ctx.restore();
  };

  // Draw background
  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const width = canvasSizeRef.current.width;
    const height = canvasSizeRef.current.height;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(1, "#09B658");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawHill(ctx, hill1BaseHeight, hill1Amplitude, hill1Stretch, "#1d4f10");
    drawHill(ctx, hill2BaseHeight, hill2Amplitude, hill2Stretch, "#011e06");

    treesRef.current.forEach((tree) => drawTree(ctx, tree));
  };

  const drawHill = (
    ctx: CanvasRenderingContext2D,
    baseHeight: number,
    amplitude: number,
    stretch: number,
    color: string
  ) => {
    const width = canvasSizeRef.current.width;
    const height = canvasSizeRef.current.height;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
    for (let i = 0; i < width; i++) {
      ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
    }
    ctx.lineTo(width, height);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawTree = (ctx: CanvasRenderingContext2D, tree: Tree) => {
    const x = (-sceneOffsetRef.current * backgroundSpeedMultiplier + tree.x) * hill1Stretch;
    const y = getTreeY(tree.x, hill1BaseHeight, hill1Amplitude);

    ctx.save();
    ctx.translate(x, y);
    const treeTrunkHeight = 5;
    const treeTrunkWidth = 2;
    const treeCrownHeight = 25;
    const treeCrownWidth = 10;

    ctx.fillStyle = "#39af43";
    ctx.fillRect(-treeTrunkWidth / 2, -treeTrunkHeight, treeTrunkWidth, treeTrunkHeight);

    ctx.beginPath();
    ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
    ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
    ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
    ctx.fillStyle = tree.color;
    ctx.fill();

    ctx.restore();
  };

  const getHillY = (windowX: number, baseHeight: number, amplitude: number, stretch: number) => {
    const height = canvasSizeRef.current.height;
    const sineBaseY = height - baseHeight;
    return (sinus((sceneOffsetRef.current * backgroundSpeedMultiplier + windowX) * stretch) *
      amplitude) + sineBaseY;
  };

  const getTreeY = (x: number, baseHeight: number, amplitude: number) => {
    const height = canvasSizeRef.current.height;
    const sineBaseY = height - baseHeight;
    return (sinus(x) * amplitude) + sineBaseY;
  };

  const drawPlatforms = (ctx: CanvasRenderingContext2D) => {
    const height = 375;
    platformsRef.current.forEach(({ x, w }) => {
      ctx.fillStyle = "black";
      ctx.fillRect(x, height - platformHeight, w, platformHeight + (canvasSizeRef.current.height - height)/2);

      // Red area - perfect zone
      const sticks = sticksRef.current;
      if (sticks.length > 0 && sticks[sticks.length - 1].x < x) {
        ctx.fillStyle = "red";
        ctx.fillRect(x + w/2 - perfectAreaSize/2, height - platformHeight, perfectAreaSize, perfectAreaSize);
      }
    });
  };

  const drawHero = (ctx: CanvasRenderingContext2D) => {
    const height = 375;
    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(heroXRef.current - heroWidth/2, heroYRef.current + height - platformHeight - heroHeight/2);

    // Hero body
    drawRoundedRect(ctx, -heroWidth/2, -heroHeight/2, heroWidth, heroHeight -4, 5);

    // Legs
    const legDistance = 5;
    ctx.beginPath();
    ctx.arc(legDistance, 11.5, 3, 0, Math.PI*2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-legDistance, 11.5, 3, 0, Math.PI*2, false);
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(5, -7, 3, 0, Math.PI*2, false);
    ctx.fill();

    // Bandana
    ctx.fillStyle = "red";
    ctx.fillRect(-heroWidth/2 - 1, -12, heroWidth+2, 4.5);
    ctx.beginPath();
    ctx.moveTo(-9, -14.5);
    ctx.lineTo(-17, -18.5);
    ctx.lineTo(-14, -8.5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-10,-10.5);
    ctx.lineTo(-15,-3.5);
    ctx.lineTo(-5,-7);
    ctx.fill();

    ctx.restore();
  };

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x:number, y:number, width:number, height:number, radius:number) => {
    ctx.beginPath();
    ctx.moveTo(x, y+radius);
    ctx.lineTo(x, y+height-radius);
    ctx.arcTo(x, y+height, x+radius, y+height, radius);
    ctx.lineTo(x+width-radius, y+height);
    ctx.arcTo(x+width, y+height, x+width, y+height-radius, radius);
    ctx.lineTo(x+width, y+radius);
    ctx.arcTo(x+width, y, x+width-radius, y, radius);
    ctx.lineTo(x+radius, y);
    ctx.arcTo(x, y, x, y+radius, radius);
    ctx.fill();
  };

  const drawSticks = (ctx: CanvasRenderingContext2D) => {
    const height = 375;
    sticksRef.current.forEach(stick => {
      ctx.save();
      ctx.translate(stick.x, height - platformHeight);
      ctx.rotate((Math.PI/180)*stick.rotation);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(0,0);
      ctx.lineTo(0,-stick.length);
      ctx.stroke();
      ctx.restore();
    });
  };

  const handleMouseDown = () => {
    if (phaseRef.current === "waiting") {
      // Deduct coins on first action in the game
      if (!hasPaidForGame) {
        updateCoins(-10); // Spend 10 coins for the game
        setHasPaidForGame(true);
      }
      
      phaseRef.current = "stretching";
      const sticks = sticksRef.current;
      if (sticks.length > 0) {
        sticks[sticks.length - 1].length = 1; 
      }
    }
  };

  const handleMouseUp = () => {
    if (phaseRef.current === "stretching") {
      phaseRef.current = "turning";
    }
  };

  return (
    <Page back={true}>
      <div className="container">
          {
              !gameOver && (
                  <>
                      <div id="score">Score: {score}</div>
                      {/* <div id="coins">Coins: {coins}</div> */}
                      <div id="introduction">Hold down the touch to stretch out a stick</div>
                  </>
              )
          }
        <div id="perfect" style={{opacity:0}}>DOUBLE SCORE</div>
        {gameOver && (
          <div className="actions flex flex-col gap-4 items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mt-2">Final score: {score}</div>
              <div className="text-xl">Coins balance: {coins}</div>
              {
                score >= 20 && (
                  <div className="text-lg text-gray-700 mb-2">
                    {score >= 20 && <div>🎉 +5 coins for 20+ score!</div>}
                    {score >= 50 && <div>🎉 +10 coins for 50+ score!</div>}
                    {score >= 100 && <div>🎉 +25 coins for 100+ score!</div>}
                  </div>
                )
              }

              <div className="flex flex-col gap-3 items-center justify-center bg-white p-4 rounded-xl border ">
                <div className="flex flex-row gap-4 items-center justify-center">
                  <Link to="/">
                      <button className="bg-white border border-green-700 text-green-700 px-4 py-2 rounded-lg text-md font-bold">
                          Home
                      </button>
                  </Link>
                  <button 
                    id="restart" 
                    className="bg-green-700 text-white px-4 py-2 rounded-lg text-md font-bold" 
                    onClick={() => {
                      resetGame();
                      setGameOver(false);
                      setHasPaidForGame(false); // Reset payment flag for new restart
                    }}
                  >
                    Restart (-10 coins)
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Or restart for free by watching an ad:</p>
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-md font-bold transition-colors duration-200"
                    onClick={showAdForRestart}
                    disabled={isWatchingAd}
                  >
                    {isWatchingAd ? 'Watching Ad...' : 'Watch Ad & Restart Free'}
                  </button>
                </div>
              </div>
              
          </div>
          )}
        <canvas
          id="game"
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={!gameOver ? handleMouseDown : () => {}}
          onMouseUp={!gameOver ? handleMouseUp : () => {}}
                  onTouchStart={!gameOver ? (e) => {
          e.preventDefault(); // Prevent scrolling or other default actions
          e.stopPropagation(); // Stop event bubbling
          handleMouseDown();
        } : () => {}}
        onTouchEnd={!gameOver ? (e) => {
          e.preventDefault();
          e.stopPropagation(); // Stop event bubbling
          handleMouseUp();
        } : () => {}}
        />
        
        {/* TADS Fullscreen Widget for free restart */}
        <TadsWidget 
          id="4" 
          type="fullscreen" 
          debug={true} 
          onShowReward={onAdReward}
        />
      </div>
    </Page>
  );
};

export default GamePage;