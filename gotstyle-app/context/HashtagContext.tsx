import { createContext, useState } from "react";

interface HashtagContextProps {
  hashtag: string;
  setHashTag: React.Dispatch<React.SetStateAction<string>>;
}

export const HashtagContext = createContext<HashtagContextProps>({
  hashtag: "# For You",
  setHashTag: () => {},
});

export const HashtagProvider = ({ children }: any) => {
  const [hashtag, setHashTag] = useState<string>("# For You");

  return (
    <HashtagContext.Provider value={{ hashtag, setHashTag }}>
      {children}
    </HashtagContext.Provider>
  );
};
