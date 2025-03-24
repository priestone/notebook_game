import React, { createContext, useContext, useState } from "react";

interface RewardsState {
  hasHeart: boolean;
  hasChildCourage: boolean;
  canRerollEquipment: boolean;
  gameStartTime: number | null;
  gameEndTime: number | null;
  playTime: string;
}

interface RewardsContextType {
  rewards: RewardsState;
  setRewards: React.Dispatch<React.SetStateAction<RewardsState>>;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rewards, setRewards] = useState<RewardsState>({
    hasHeart: false,
    hasChildCourage: false,
    canRerollEquipment: false,
    gameStartTime: null,
    gameEndTime: null,
    playTime: "00:00",
  });

  return (
    <RewardsContext.Provider value={{ rewards, setRewards }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error("useRewards must be used within a RewardsProvider");
  }
  return context;
};
