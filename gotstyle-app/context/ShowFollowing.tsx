import { createContext, useState } from "react";

export const ShowFollowingContext = createContext({
  showFollowing: false,
  setShowFollowing: (showFollowing: boolean) => {},
});

export const ShowFollowingProvider = ({ children }: any) => {
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <ShowFollowingContext.Provider value={{ showFollowing, setShowFollowing }}>
      {children}
    </ShowFollowingContext.Provider>
  );
};
